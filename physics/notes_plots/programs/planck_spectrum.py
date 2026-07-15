import numpy as np
import matplotlib.pyplot as plt
from scipy.constants import hbar, c, k

def planck_spectrum(omega, T):
    return (hbar * omega**3) / (np.pi**2 * c**3) / (np.exp(hbar * omega / (k * T)) - 1)

# Cs D2 line frequency
lambda_852 = 852e-9
omega_eg = 2 * np.pi * c / lambda_852
nu_eg = omega_eg / (2 * np.pi)  # in Hz

# Frequency range in THz
nu = np.linspace(0e12, 1000e12, 1000)  # 100-1000 THz
omega = 2 * np.pi * nu

# Temperatures
T1 = 4000
T2 = 5000
T3 = 6000

u1 = planck_spectrum(omega, T1)
u2 = planck_spectrum(omega, T2)
u3 = planck_spectrum(omega, T3)

plt.figure(figsize=(8, 5))
plt.plot(nu/1e12, u1, 'b-', linewidth=2.5, label=f'T = {T1} K')
plt.plot(nu/1e12, u2, 'r-', linewidth=2.5, label=f'T = {T2} K')
plt.plot(nu/1e12, u3, 'g-', linewidth=2.5, label=f'T = {T3} K')

# Mark Cs D2 line
plt.axvline(x=nu_eg/1e12, color='k', linestyle='--', linewidth=1.5, alpha=0.7, label='Cs D2 line (852 nm)')

plt.xlabel('Frequency $\\nu$ (THz)', fontsize=12)
plt.ylabel('Spectral Energy Density $u(\\omega)$', fontsize=12)
#plt.title('(b) Planck Blackbody Spectrum', fontsize=13, fontweight='bold')
plt.legend(fontsize=10)
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()