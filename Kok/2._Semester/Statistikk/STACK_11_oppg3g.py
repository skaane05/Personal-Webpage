from math import comb
from scipy.stats import norm

n = 14
u_obs = 10
p_verdi = 0
p = 0.5

#Oppgave 3g)
for u in range(10, n+1):
    p_verdi += comb(n, u)*(p**u)*((1-p)**(n-u))

print(p_verdi)


#Oppgave 3h)
teststyrke=0
p_H1 = 0.7995
for u in range(0, 11):
    teststyrke += comb(n, u)*(p_H1**u)*((1-p_H1)**(n-u))
print(1-teststyrke)
