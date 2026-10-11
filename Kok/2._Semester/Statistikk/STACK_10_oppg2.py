from math import comb #nCr

p = 4/16
n = 16

def testobservator(x):
    s = 0
    for i in range(x,n+1):
        s += comb(n, i)*(p**i)*(1-p)**(n-i)

    return s

#Oppgave c)
c = 0 #startverdi
while testobservator(c) > 0.05:
 c += 1

c -= 1 #hvis f.eks. 3 er den siste verdien som oppfyller ulikhet,
#vil while-løkken kjøre, og dermed gi en for høy verdi
print(f"Den kritiske verdien som gjør at signifikansnivået er 0.05 er: {c}")

y=0
while testobservator(y) > 0.05:
 y += 1
print(f"Verdi som oppfyller likningen  {testobservator(y)}") 