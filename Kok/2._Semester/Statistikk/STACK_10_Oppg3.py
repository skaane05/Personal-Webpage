#STACK_10_Oppg3.py
import numpy as np
my_0 = 16
 
x = np.array([15.61, 15.65, 16.24, 16.33, 16.45, 16.32])

snitt = np.mean(x)
n = len(x)

s2 = 1/(n-1)*sum([(i-snitt)**2 for i in x])
s = np.sqrt(s2)

def testobservator():
    global teller, nevner
    teller = snitt - my_0
    nevner = s/np.sqrt(6)

    return teller/nevner



#Oppgave a)
#P(T>k) = 0.05
#P(T=<k) = 0.95
#Finner kritisk verdi for t-fordeling når v = n-1 og alfa = 0.05
#k = 2.015

#Oppgave b)
#print(testobservator()) => 0.661...

print(snitt - 0.6613*s/np.sqrt(6))
