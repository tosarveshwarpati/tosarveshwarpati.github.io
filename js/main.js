document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.site-nav a');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.endsWith(currentPath)) {
      link.classList.add('active');
    }
  });
});
