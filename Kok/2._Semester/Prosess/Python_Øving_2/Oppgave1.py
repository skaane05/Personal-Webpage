from scipy.optimize import root, fsolve
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

#Data

A = 50.0 #m2
U = 150.0 #W/m2
m_c = 12 #kg/s
cp_C = 1500 #J/kgK
T_inn_C = 273+20 #K Kald strøm temperatur inn
m_h = 10
cp_H = 1200
T_inn_H = 272+70 #K Varm strøm temperatur inn

#Motstrøms varmeveksler. 
#Antar konstante varmekapasiteter og ideell motstrøm:
"""
a) og b)

dT1 = T_inn_H - T_ut_C

dT2 = T_ut_h - T_inn_C

dTlm = (dT1 - dT2)/log(dT1/dT2)

Q = U*A*dTlm

Q = m_c*p_C*(T_ut_C - T_inn_C)
Q = m_h*cp_H*(T_ut_H - T_inn_H)

Omrokkering for disse gir:
"""
def likninger(ukjente, m_c): #har med m_C her for oppgave e -> f
    T_ut_C, T_ut_H, Q_u, dTlm = ukjente #Q_ukjent
    
    dT1 = T_inn_H - T_ut_C 
    dT2 = T_ut_H - T_inn_C 
    
    return [
       U*A*dTlm - Q_u, 
       m_c*cp_C*(T_ut_C - T_inn_C) - Q_u,
       m_h*cp_H*(T_ut_H - T_inn_H) + Q_u, 
       (dT1 - dT2)/(np.log(dT1 / dT2)) - dTlm,
    ]


"""
m_c = [12, 15, 20, 25, 30] tar i += 5 fra 15 intervaller?
plott m_c mot: 
T_ut_h (y-akse)
T_ut_c
Q 
"""
m_c_verdier = np.linspace(10, 35, 25) 
T_ut_C_verdier = []
T_ut_H_verdier = []
Q_verdier = []
dT_lim_verdier = []

# Gjett initialverdier for de ukjente
initial_guess = [273+30, 273+50, 250000, 35]


for i in m_c_verdier:
    #i guess vanlig fsolve() funker, men bruker lambda ukjente for å kalle på likninger
    #med ukjente som fremdeles ukjent
    løsning = root(likninger, initial_guess, args=(i,), method = 'hybr') 
    T_ut_C_verdier.append(løsning.x[0] - 273 ) #C
    T_ut_H_verdier.append(løsning.x[1] - 273) #C
    Q_verdier.append(løsning.x[2] / 10e3) # kW
    dT_lim_verdier.append(løsning.x[3])

    initial_guess = løsning.x #oppdaterer initialgjett 

fig, ax = plt.subplots(1, 2, figsize=(12, 6))  # Lager en figur med 2 subplots
ax[0].plot(m_c_verdier, T_ut_C_verdier, color = 'red', label = "T_ut_cold / C")
ax[0].plot(m_c_verdier, T_ut_H_verdier, color = "green", label = "T_ut_hot / C")
ax[0].plot(m_c_verdier, Q_verdier, color = "yellow", label = "Q / $kW$" ) 
ax[0].plot(m_c_verdier, dT_lim_verdier, color ="black", label="dTlm")
ax[0].legend(loc = "best")
ax[0].set_xlabel("m_c")

#verdier til tabellen
targets = [12, 15, 20, 25, 30]

ny_targets = [f-10 for f in targets]

a, b, c, d, e = ny_targets
print(ny_targets)

T_c_li = [T_ut_C_verdier[a],T_ut_C_verdier[b],T_ut_C_verdier[c],T_ut_C_verdier[d], T_ut_C_verdier[e]]
T_h_li = [T_ut_H_verdier[a],T_ut_H_verdier[b],T_ut_H_verdier[c],T_ut_H_verdier[d], T_ut_H_verdier[e]]
Q_li = [Q_verdier[a],Q_verdier[b],Q_verdier[c],Q_verdier[d], Q_verdier[e]]

T_c_av = [round(i, 3) for i in T_c_li]
T_h_av = [round(i, 3) for i in T_h_li]
Q_av = [round(i, 3) for i in Q_li]

#setter opp tabellen med en kombinasjon av pandas (lager tabell) og matplotlib (plotter tabell ved siden av graf)
df = pd.DataFrame({'M_c / (kg/s)':
                   [round(i,0) for i in [m_c_verdier[a], m_c_verdier[b], m_c_verdier[c], m_c_verdier[d], m_c_verdier[e]]],
                   'T_ut_c / C' : T_c_av,
                   'T_ut_h / C': T_h_av,
                   'Q / kW': Q_av,
                   })

ax[1].axis('off')
col_widths = [0.2]*len(df.columns)

table = pd.plotting.table(ax[1], df, loc='center', cellLoc='center', colWidths=col_widths)
plt.tight_layout()
plt.show()

