#Oppgave2.py
from scipy.optimize import root
import pandas as pd #for tabellvisning av svar

X = omsetningsgrad = 0.25

def ligninger(ukjente):
    n2, n3, n5, n6, n7, n4, n2_N, n3_N, n5_N, n6_N, n7_N, n2_H, n3_H, n5_H, n6_H, n7_H, n2_M, n3_M, n5_M, n6_M, n7_M, n3_A, n4_A, t, reaksjonsomfang = ukjente

    n1_N = 24
    n1_H = 72
    n1_M = 4
    return [
        n2 - (n2_N + n2_H + n2_M),
        n3 - (n3_N + n3_H + n3_M + n3_A),
        n4 - (n4_A),
        n5 - (n5_N + n5_H + n5_M),
        n6 - (n6_N + n6_H + n6_M),
        n7 - (n7_N + n7_H + n7_M),

        n1_N + n7_N - n2_N,
        n1_H + n7_H - n2_H,
        n1_M + n7_M - n2_M,

        n2_M/n2 - 0.1579,

        reaksjonsomfang - n2_N*0.25,
        n3_N - (n2_N - reaksjonsomfang),
        n3_H - (n2_H - 3*reaksjonsomfang),
        n3_M - n2_M,
        n3_A - 2*reaksjonsomfang,

        n5_N - n3_N,
        n5_H - n3_H,
        n5_M - n3_M,
        n4_A - n3_A,

        n7_N - n5_N*t,
        n7_H - n5_H*t,
        n7_M - n5_M*t,

        n6_N - n5_N*(1-t),
        n6_H - n5_H*(1-t),
        n6_M - n5_M*(1-t),
    ]

initialgjett = [100 for _ in range(25)]

solution = root(ligninger, initialgjett, method="lm") #method = 'hybr' (standard) skal også funke

#n2, n3, n5, n6, n7, n4, n2_N, n3_N, n5_N, n6_N, n7_N, n2_H, n3_H, n5_H, n6_H, n7_H, n2_M, n3_M, n5_M, n6_M, n7_M, n3_A, n4_A, t, reaksjonsomfang = ukjente


if solution.success:
    data = {
        "Molstrømmer" : [solution.x[i] for i in range(6)],
        "Nitrogen" : [solution.x[i] for i in range(6, 11)] + [0.00],
        "Hydrogen" : [solution.x[i] for i in range(11,16)] + [0.00],
        "Metan" : [solution.x[i] for i in range(16, 21)] + [0.00],
        "Ammoniakk": [0.00] + [solution.x[21]] + [0.00, 0.00, 0.00] + [solution.x[22]],
    }
    df = pd.DataFrame(data, index=['n2', 'n3', 'n5', 'n6', 'n7', 'n4'])
    print(df)
    print(f"Verdi for t: {solution.x[-2]:.3f}")
    print(f"Verdi for Reaksjonsomfang: {solution.x[-1]:.3f}")
else:
    print("Fant ingen løsning:", solution.message)