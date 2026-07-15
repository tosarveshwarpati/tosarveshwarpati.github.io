import numpy as np
import matplotlib.pyplot as plt
from scipy.constants import c, hbar, epsilon_0

# Cs D2 line parameters
lambda_852 = 852e-9
omega_eg = 2 * np.pi * c / lambda_852
d_eg = 2.03e-29

# Spectral density function
def J(omega):
    return (omega**3 * d_eg**2) / (6 * np.pi**2 * epsilon_0 * hbar * c**3)

# Frequency range
omega = np.linspace(0.5*omega_eg, 1.5*omega_eg, 1000)
J_omega = J(omega)

# Convert to THz for x-axis
nu = omega / (2 * np.pi) / 1e12
nu_eg = omega_eg / (2 * np.pi) / 1e12

# Plot
plt.figure(figsize=(8, 5))
plt.plot(nu, J_omega, 'b-', linewidth=2.5)

# Mark transition frequency
plt.axvline(x=nu_eg, color='r', linestyle='--', linewidth=1.5)

# Calculate and mark linewidth
Gamma = (omega_eg**3 * d_eg**2) / (3 * np.pi * epsilon_0 * hbar * c**3)
linewidth = Gamma / (2 * np.pi) / 1e12
plt.axvspan(nu_eg - 3*linewidth, nu_eg + 3*linewidth, alpha=0.15, color='red')

# Labels
plt.xlabel('Frequency $\\nu$ (THz)', fontsize=12)
plt.ylabel('Spectral Density $J(\\omega)$', fontsize=12)
#plt.title('(b) Spectral Density of EM Reservoir', fontsize=13, fontweight='bold')
plt.grid(True, alpha=0.3)
plt.xlim([nu[0], nu[-1]])

plt.tight_layout()
plt.show()