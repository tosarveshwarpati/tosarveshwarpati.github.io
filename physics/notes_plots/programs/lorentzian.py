import numpy as np
import matplotlib.pyplot as plt
from scipy.constants import c, hbar, epsilon_0

# Cs D2 line parameters
lambda_852 = 852e-9
omega_eg = 2 * np.pi * c / lambda_852
d_eg = 2.03e-29

# Calculate decay rate (linewidth)
Gamma = (omega_eg**3 * d_eg**2) / (3 * np.pi * epsilon_0 * hbar * c**3)

# Frequency range around resonance (in angular frequency)
omega = np.linspace(omega_eg - 10*Gamma, omega_eg + 10*Gamma, 1000)

# Lorentzian line shape (ignoring Lamb shift)
def lorentzian(omega, omega0, Gamma):
    return 1 / ((omega - omega0)**2 + (Gamma/2)**2)

spectrum = lorentzian(omega, omega_eg, Gamma)

# Convert to THz for x-axis
nu = omega / (2 * np.pi) / 1e12
nu_eg = omega_eg / (2 * np.pi) / 1e12
linewidth_THz = Gamma / (2 * np.pi) / 1e12
linewidth_MHz = linewidth_THz * 1e6

# Plot
plt.figure(figsize=(8, 5))
plt.plot(nu, spectrum, 'g-', linewidth=2.5)

# Mark center and FWHM
plt.axvline(x=nu_eg, color='k', linestyle='--', linewidth=1, alpha=0.5)
plt.axhline(y=np.max(spectrum)/2, color='k', linestyle=':', linewidth=1, alpha=0.5)

# Annotations with decimal notation
plt.text(0.02, 0.92, f'FWHM = {linewidth_MHz:.3f} MHz', transform=plt.gca().transAxes, fontsize=11)
plt.text(0.02, 0.85, f'$\\Gamma$ = {Gamma:.3e} s$^{{-1}}$', transform=plt.gca().transAxes, fontsize=11)

# Labels
plt.xlabel('Frequency $\\nu$ (THz)', fontsize=12)
plt.ylabel('Emission Intensity (arb. units)', fontsize=12)
#plt.title('(d) Lorentzian Emission Line Shape', fontsize=13, fontweight='bold')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()