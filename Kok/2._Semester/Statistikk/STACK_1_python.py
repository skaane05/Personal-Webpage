import numpy as np
import matplotlib.pyplot as plt
# Sett hvilke x-verdier du vil plotte for
x = np.linspace(0,5,100)
# Sett verdien for parameteren alpha
alpha = 1
# Beregn så sannsynlighetstettheten og plott opp funksjonen
def f(x, alpha):
    return -(2*x/alpha)*np.exp(-(x**2)/alpha)

plt.plot(x, f(x, alpha), color="red")
#plt.plot(x, F(x, alpha), color="green")
plt.xlabel("x")
plt.ylabel("F(x)")
plt.show()
