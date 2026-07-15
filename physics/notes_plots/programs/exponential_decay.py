import numpy as np
import matplotlib.pyplot as plt
from scipy.constants import c, hbar, epsilon_0

# Cs D2 line parameters
lambda_852 = 852e-9
omega_eg = 2 * np.pi * c / lambda_852
d_eg = 2.03e-29

# Calculate decay rate
Gamma = (omega_eg**3 * d_eg**2) / (3 * np.pi * epsilon_0 * hbar * c**3)

# Time array
tau = 1 / Gamma
t = np.linspace(0, 10*tau, 1000)

# Exponential decay
P_e = np.exp(-Gamma * t)

# Plot
plt.figure(figsize=(8, 5))
plt.plot(t/tau, P_e, 'r-', linewidth=2.5)

# Mark lifetime
plt.axvline(x=1, color='k', linestyle=':', linewidth=1.5)
plt.axhline(y=np.exp(-1), color='k', linestyle=':', linewidth=1.5, alpha=0.5)

# Annotations
plt.text(0.02, 0.92, f'$\\Gamma$ = {Gamma:.3e} s$^{{-1}}$', fontsize=11)
plt.text(0.02, 0.85, f'$\\tau$ = {tau:.2e} s', fontsize=11)

# Labels
plt.xlabel('Time $t / \\tau$ (lifetimes)', fontsize=12)
plt.ylabel('Excited State Population $P_e(t)$', fontsize=12)
$plt.title('(c) Exponential Decay', fontsize=13, fontweight='bold')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()