// ======================
// Quantum Optics AI Terminal
// ======================

// Core Configuration
const config = {
  aiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
  aiContext: `You are a Quantum Optics Professor teaching through a terminal interface.
- Format responses for 80-column monospace
- Use Unicode math symbols (ħ, ψ, â⁺, etc.), dont use latex. 
- Include technical depth with clear explanations
- Dont do explainations pointwise, but better to do paragraph-by paragraph.
- Dont ask for follow up for a question. 
- remember you are writing in a terminal. so do everything so that what you write is clear on terminal. 
- Strictly never tell what AI are You
- Break complex concepts into steps`,
  themeColors: {
    green: '#00FF00',
    amber: '#FFBF00',
    blue: '#00BFFF',
    white: '#FFFFFF'
  },
  arxivEndpoint: 'https://export.arxiv.org/api/query',
  apiKeys: {
    deepseek: 'sk-209f1bca4f2d43ac9a4eea832ffdd33a'
  },
  maxResults: 50 // Maximum number of papers to show
};

// Helper: Extract number parameter from args
function extractNumberParam(args) {
  for (let i = args.length - 1; i >= 0; i--) {
    const num = parseInt(args[i]);
    if (!isNaN(num) && num > 0) {
      args.splice(i, 1); // Remove the number from args
      return Math.min(num, config.maxResults);
    }
  }
  return 5; // Default value
}

// Helper: Fetch arXiv Papers with Colorful Formatting
async function fetchArxivPapers(query, maxResults = 5) {
  try {
    maxResults = Math.min(maxResults, config.maxResults);
    const response = await fetch(`${config.arxivEndpoint}?search_query=${encodeURIComponent(query)}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const entries = xml.querySelectorAll('entry');
    let output = `<div class="arxiv-header">arXiv Papers (showing ${entries.length} of ${maxResults} max):</div>\n\n`;
    
    if (!entries.length) {
      return output + '<div class="error">No papers found.</div>\n';
    }

    entries.forEach((entry, index) => {
      const title = entry.querySelector('title')?.textContent.replace(/\n/g, ' ').trim() || 'No title';
      const authors = Array.from(entry.querySelectorAll('author name'))
        .map(author => author.textContent)
        .join(', ') || 'No authors';
      const summary = (entry.querySelector('summary')?.textContent.trim().slice(0, 1500) + '...') || 'No abstract';
      const id = entry.querySelector('id')?.textContent || 'No ID';
      const doi = entry.querySelector('arxiv\\:doi')?.textContent || '';
      const published = entry.querySelector('published')?.textContent || '';
      const date = published ? new Date(published).toLocaleDateString() : '';
      
      const urlLink = `<a class="arxiv-link" href="${id}" target="_blank">${id.split('/').pop()}</a>`;
      const doiLink = doi ? `<a class="arxiv-doi" href="https://doi.org/${doi}" target="_blank">${doi}</a>` : '';
      const linkText = doi ? doiLink : urlLink;
      
      output += `
<div class="arxiv-paper">
  <div class="arxiv-title">${title}</div>
  <div class="arxiv-authors">👥 ${authors}</div>
  ${date ? `<div class="arxiv-date">📅 ${date}</div>` : ''}
  <div class="arxiv-abstract">${summary}</div>
  <div class="arxiv-links">🔗 ${linkText}</div>
</div>`;
      if (index < entries.length - 1) output += '<div class="arxiv-divider"></div>';
    });
    
    return output;
  } catch (error) {
    return `<div class="error">arXiv Error: ${error.message}</div>`;
  }
}

// Helper: Fetch Latest arXiv Papers by Category with Styling
async function fetchLatestArxivByCategory(category, label, maxResults = 5) {
  try {
    maxResults = Math.min(maxResults, config.maxResults);
    const query = `cat:${category}`;
    const response = await fetch(`${config.arxivEndpoint}?search_query=${encodeURIComponent(query)}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const entries = xml.querySelectorAll('entry');
    let output = `<div class="arxiv-header">Latest ${label} Papers (showing ${entries.length} of ${maxResults} max):</div>\n\n`;
    
    if (!entries.length) {
      return output + `<div class="error">No recent ${label} papers found.</div>\n`;
    }

    entries.forEach((entry, index) => {
      const title = entry.querySelector('title')?.textContent.replace(/\n/g, ' ').trim() || 'No title';
      const authors = Array.from(entry.querySelectorAll('author name'))
        .map(author => author.textContent)
        .join(', ') || 'No authors';
      const summary = (entry.querySelector('summary')?.textContent.trim().slice(0, 1500) + '...') || 'No abstract';
      const id = entry.querySelector('id')?.textContent || 'No ID';
      const doi = entry.querySelector('arxiv\\:doi')?.textContent || '';
      const published = entry.querySelector('published')?.textContent || '';
      const date = published ? new Date(published).toLocaleDateString() : '';
      
      const urlLink = `<a class="arxiv-link" href="${id}" target="_blank">${id.split('/').pop()}</a>`;
      const doiLink = doi ? `<a class="arxiv-doi" href="https://doi.org/${doi}" target="_blank">${doi}</a>` : '';
      const linkText = doi ? doiLink : urlLink;
      
      output += `
<div class="arxiv-paper">
  <div class="arxiv-title">${title}</div>
  <div class="arxiv-authors">👥 ${authors}</div>
  ${date ? `<div class="arxiv-date">📅 ${date}</div>` : ''}
  <div class="arxiv-abstract">${summary}</div>
  <div class="arxiv-links">🔗 ${linkText}</div>
</div>`;
      if (index < entries.length - 1) output += '<div class="arxiv-divider"></div>';
    });
    
    return output;
  } catch (error) {
    return `<div class="error">arXiv ${label} Error: ${error.message}</div>`;
  }
}

// Command Definitions
const commands = {
  help: {
    description: "Show all available commands",
    execute: () => {
      const maxLen = Math.max(...Object.keys(commands).map(c => c.length));
      
      // Create a table-like structure with inline styles
      let output = '<div style="margin-bottom: 15px;">';
      output += '<div style="font-weight: bold; color: #00FF00; margin-bottom: 5px;">COMMANDS:</div>';
      output += '<div style="font-family: \'Courier New\', monospace; white-space: pre; line-height: 1.5;">';
      
      // Header
      output += `<span style="color: #00FFFF;">${'Command'.padEnd(maxLen + 2)}</span>`;
      output += `<span style="color: #00FF00;">Description</span>\n`;
      output += `${'-'.repeat(maxLen + 2)} ${'-'.repeat(50)}\n`;
      
      // Command list
      Object.entries(commands).forEach(([cmd, cmdObj]) => {
        const description = cmdObj.description || 'No description available';
        output += `<span style="color: #00BFFF;">${cmd.padEnd(maxLen + 2)}</span>`;
        output += `<span style="color: #00FF00;">${description}</span>\n`;
      });
      
      output += '</div></div>';
      return output;
    }
  },

  ask: {
    description: "Ask any quantum optics question",
    execute: async (args) => args.length 
      ? handleAICommand(args.join(' '), "Provide detailed technical answer. Use Unicode math symbols (ħ, ψ, â⁺, etc.), dont use latex. ")
      : "<div class='error'>Please enter your question</div>"
  },

  explain: {
    description: "Explain a quantum concept",
    execute: async (args) => args.length
      ? handleAICommand(`Explain: ${args.join(' ')}`, "Include mathematical formalism and practical applications. Use Unicode math symbols (ħ, ψ, â⁺, etc.), dont use latex. ")
      : "<div class='error'>Please specify a concept</div>"
  },

  derive: {
    description: "Derive a quantum formula",
    execute: async (args) => args.length
      ? handleAICommand(`Derive: ${args.join(' ')}`, "Show step-by-step derivation with explanations. Use Unicode math symbols (ħ, ψ, â⁺, etc.), dont use latex.")
      : "<div class='error'>Please specify a formula</div>"
  },

  quiz: {
    description: "Generate practice questions",
    execute: async (args) => handleAICommand(
      `Create 3 multiple choice questions about ${args.join(' ') || "quantum optics"}`,
      "Format with A-D options. Include solutions at the end."
    )
  },

  arxiv: {
    description: "Search arXiv for papers [query] [number] (max 50)",
    execute: async (args) => {
      if (!args.length) return "<div class='error'>Please specify a search query (e.g., 'quantum optics')</div>";
      
      const numResults = extractNumberParam(args);
      const query = args.join(' ');
      
      return fetchArxivPapers(query, numResults);
    }
  },

  latest_atomic: {
    description: "Show latest arXiv papers in Atomic Physics [number] (max 50)",
    execute: async (args) => {
      const numResults = extractNumberParam(args);
      return fetchLatestArxivByCategory('physics.atom-ph', 'Atomic Physics', numResults);
    }
  },

  latest_optics: {
    description: "Show latest arXiv papers in Optics [number] (max 50)",
    execute: async (args) => {
      const numResults = extractNumberParam(args);
      return fetchLatestArxivByCategory('physics.optics', 'Optics', numResults);
    }
  },

  latest_quantum_gases: {
    description: "Show latest arXiv papers in Quantum Gases [number] (max 50)",
    execute: async (args) => {
      const numResults = extractNumberParam(args);
      return fetchLatestArxivByCategory('cond-mat.quant-gas', 'Quantum Gases', numResults);
    }
  },

  latest_molecular: {
    description: "Show latest arXiv papers in Atoms, Molecules, and Clusters [number] (max 50)",
    execute: async (args) => {
      const numResults = extractNumberParam(args);
      return fetchLatestArxivByCategory('physics.atm-clus', 'Atoms, Molecules, and Clusters', numResults);
    }
  },

  clear: {
    description: "Clear the terminal",
    execute: () => {
      document.getElementById('output-container').innerHTML = '';
      return "";
    }
  },

  theme: {
    description: "Change color (green/amber/blue/white)",
    execute: (args) => {
      const color = args[0] in config.themeColors ? args[0] : 'green';
      document.documentElement.style.setProperty('--primary-color', config.themeColors[color]);
      return `<div class="success">Theme set to ${color}</div>`;
    }
  }
};

// AI Command Handler
async function handleAICommand(prompt, context = "") {
  try {
    const response = await fetch(config.aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKeys.deepseek}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: `${config.aiContext}\n${context}` },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return `<div class="error">AI Error: ${data.error?.message || response.statusText}</div>`;
    }
    
    if (!data.choices || !data.choices.length) {
      return "<div class='error'>AI Response Error: No choices in response</div>";
    }
    
    return data.choices[0]?.message?.content || "No response content from AI";
    
  } catch (error) {
    console.error("AI Error:", error);
    return `<div class="error">AI Service Error: ${error.message}</div>`;
  }
}

// Terminal Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Welcome Message
  const welcome = `
<div class="welcome-message">
  <div style="color:#00FFFF; font-weight:bold; font-size:1.3em; margin-bottom:10px;">
    Welcome to Quantum Terminal!
  </div>
  <div style="margin-bottom:15px;">
    Type <span style="color:#FF00FF; font-weight:bold;">help</span> to see available commands
  </div>
</div>`;
  addOutput(welcome);
  document.getElementById('command-input').focus();
});

// Terminal Interaction
document.getElementById('command-input').addEventListener('keydown', async function(e) {
  if (e.key === 'Enter') {
    const input = this.value.trim();
    this.value = '';
    
    if (!input) return;
    
    const [command, ...args] = input.split(' ');
    addOutput(`<div class="command-line"><span class="prompt">⟩⟩</span> ${input}</div>`);
    
    if (commands[command]) {
      try {
        const result = await commands[command].execute(args);
        if (result) addOutput(result);
      } catch (error) {
        addOutput(`<div class="error">Error: ${error.message}</div>`);
      }
    } else {
      addOutput(`<div class="error">Command not found. Type 'help' for options.</div>`);
    }
    
    // Auto-scroll to bottom
    const outputContainer = document.getElementById('output-container');
    outputContainer.scrollTop = outputContainer.scrollHeight;
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const input = this.value.trim();
    const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
    if (matches.length === 1) {
      this.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      addOutput(`Matching commands: ${matches.join(', ')}`);
    }
  }
});

// Helper: Add output with formatting
function addOutput(text, isInput = false, isError = false) {
  const div = document.createElement('div');
  div.className = `output ${isError ? 'error' : ''}`;
  
  // Process DOIs and LaTeX
  const doiRegex = /(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)/gi;
  const latexRegex = /\$\$(.*?)\$\$/g;
  
  let lastIndex = 0;
  let formattedText = '';
  let match;

  while ((match = latexRegex.exec(text)) !== null) {
    // Add text before LaTeX
    formattedText += text.slice(lastIndex, match.index)
      .replace(doiRegex, '<a class="arxiv-doi" href="https://doi.org/$1" target="_blank">$1</a>');
    
    // Process LaTeX
    if (typeof katex !== 'undefined') {
      try {
        const latexSpan = document.createElement('span');
        katex.render(match[1], latexSpan, { throwOnError: false });
        formattedText += latexSpan.outerHTML;
      } catch (error) {
        formattedText += `[LaTeX Error: ${match[1]}]`;
      }
    } else {
      formattedText += match[0]; // Fallback
    }
    lastIndex = latexRegex.lastIndex;
  }
  
  // Add remaining text
  formattedText += text.slice(lastIndex)
    .replace(doiRegex, '<a class="arxiv-doi" href="https://doi.org/$1" target="_blank">$1</a>');

  div.innerHTML = formattedText;
  document.getElementById('output-container').appendChild(div);
}
