const Pristyper = [
    "Vinner 🏆",
    "Showpris🎭",
    "Fiaskopris💥",
    "Ingen :(",
    "Ikke oppført"
];

const Innslagstype = [
    "Klasseinnslag",
    "Åpent innslag",
    "Laborachorium/CHIT",
    "HC-Styret",
    "Eksterne",
    "Annet"
];

function getKull(klassetrinn, år) {
    if (klassetrinn === 0) return null;
    return `Klasse ${år + 5 - klassetrinn}`;
}

const songs = [
    {
        name: "Woo-hoo - Klasse 28 (2026)🏆",
        file: "/Audio/CGP_Sanger/3-klasse-CGP-2026.mp3",
        year: 2026, award: Pristyper[0], type: Innslagstype[0],
        grade: 3, kull: getKull(3, 2026),
        gruppe: "Klasse 28",
    },
    {
        name: "AC Style - AC  (2026)",
        file: "/Audio/CGP_Sanger/AC-style.mp3",
        year: 2025, award: Pristyper[3], type: Innslagstype[1],
        grade: 0, kull: null,
        gruppe: "Audiochromatene",

    },
    {
        name: "DALJEKÅT - (2018)",
        file: "/Audio/CGP_Sanger/DALJEKÅT.mp3",
        year: 2018, award: Pristyper[4], type: Innslagstype[1],
        grade: 0, kull: null,
        gruppe: "Ukjent",

    },
    {
        name: "En gang til - De gamle (2023)",
        file: "/Audio/CGP_Sanger/De-Gamle_En-gang-til_CGP2023.mp3",
        year: 2023, award: Pristyper[4], type: Innslagstype[0],
        grade: 6, kull: getKull(6, 2023),
        gruppe: "De gamle (klasse 22)",
    },
    {
        name: "Hebraisk Kokevise - Klasse 27 (2023)",
        file: "/Audio/CGP_Sanger/Hebraisk_kokevise_CGP2023.mp3",
        year: 2023, award: Pristyper[0], type: Innslagstype[0],
        grade: 1, kull: getKull(1, 2023),
        gruppe: "Klasse 27",
    },
    {
        name: "Laboratoddy (2026)",
        file: "/Audio/CGP_Sanger/Laboratoddy_CGP2026.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[2],
        grade: 0, kull: null,
        gruppe: "Laborachorium ft. TapHel & Toddy"
    },
    {
        name: "Nanjing House - De gamle (2026)💥",
        file: "/Audio/CGP_Sanger/Nanjing-House.mp3",
        year: 2026, award: Pristyper[2], type: Innslagstype[0],
        grade: 6, kull: getKull(6, 2026),
        gruppe: "De gamle"
    },
    {
        name: "GFP - Operon (2026)",
        file: "/Audio/CGP_Sanger/Operon-Glow.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[4],
        grade: 0, kull: null,
        gruppe: "Operon",
    },
    {
        name: "Pølse i Lompe - Team KJEMPEGRILL (2025)🎭",
        file: "/Audio/CGP_Sanger/Pølse i Lompe - Team KJEMPEGRILL.mp3",
        year: 2025, award: Pristyper[1], type: Innslagstype[1],
        grade: 0, kull: null,
        gruppe: "Team KJEMPEGRILL"
    },
    {
        name: "MVA - Styret V26",
        file: "/Audio/CGP_Sanger/Styret.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[3],
        grade: 0, kull: null,
        gruppe: "Styret V26"
    },
    {
        name: "Alle i Hopa (2000)",
        file: "/Audio/CGP_Sanger/Bakgaardspojkarna-Alle_i_hopa_2000.mp3",
        year: 2000, award: Pristyper[4], type: Innslagstype[5],
        grade: 0, kull: null,
        gruppe: "Ukjent"
    },
    {
        name: "The Notorious B.I.G. O-Notation - Nabla 2026",
        file: "/Audio/CGP_Sanger/The Notorious B.I.G. O-Notation - Nabla.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[4],
        grade: 0, kull: null,
        gruppe: "Nabla"
    },
    {
        name: "Bernoulli & Baddies - Nabla 2025",
        file: "/Audio/CGP_Sanger/Bernoulli & Baddies - Nabla.mp3",
        year: 2025, award: Pristyper[3], type: Innslagstype[4],
        grade: 0, kull: null,
        gruppe: "Nabla"
    },
    {
        name: "Den Gule Armé - Klasse 27 (2025)💥",
        file: "/Audio/CGP_Sanger/Den Gule Armé.mp3",
        year: 2025, award: Pristyper[2], type: Innslagstype[0],
        grade: 3, kull: getKull(3, 2025),
        gruppe: "Klasse 27"
    },
    {
        name: "Deriver meg mykt professor - Klasse 29 (2025)🏆",
        file: "/Audio/CGP_Sanger/Deriver meg mykt professor.mp3",
        year: 2025, award: Pristyper[0], type: Innslagstype[0],
        grade: 1, kull: getKull(1, 2025),
        gruppe: "Klasse 29"
    },
    {
        name: "Drømmen om dreams - Klasse 28 (2025)",
        file: "/Audio/CGP_Sanger/Drømmen om dreams.mp3",
        year: 2025, award: Pristyper[3], type: Innslagstype[0],
        grade: 2, kull: getKull(2, 2025),
        gruppe: "Klasse 28"
    },
    {
        name: "Du vil ikke tro hva vi vet om deg - Sugepumpa (2026)",
        file: "/Audio/CGP_Sanger/Du vil ikke tro hva vi vet om deg.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[1],
        grade: 0, kull: null,
        gruppe: "Sugepumpa"
    },
    {
        name: "Fosskokte kjemikere - Klasse 29 (2026)",
        file: "/Audio/CGP_Sanger/Fosskokte kjemikere.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[0],
        grade: 2, kull: getKull(2, 2026),
        gruppe: "Klasse 29"
    },
    {
        name: "Helvettes Mye Styr - Klasse 27 (2026)",
        file: "/Audio/CGP_Sanger/Helvettes Mye Styr.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[0],
        grade: 4, kull: getKull(4, 2026),
        gruppe: "Klasse 27"
    },
    {
        name: "Kom dere hjem! - Klasse 26 (2025)",
        file: "/Audio/CGP_Sanger/Kom dere hjem!.mp3",
        year: 2025, award: Pristyper[3], type: Innslagstype[0],
        grade: 4, kull: getKull(4, 2025),
        gruppe: "Klasse 26"
    },
    {
        name: "Konsulent - Klasse 26 (2026)",
        file: "/Audio/CGP_Sanger/Konsulent.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[0],
        grade: 5, kull: getKull(5, 2026),
        gruppe: "Klasse 26"
    },
    {
        name: "Konteland - Klasse 30 (2026)🎭",
        file: "/Audio/CGP_Sanger/Konteland.mp3",
        year: 2026, award: Pristyper[1], type: Innslagstype[0],
        grade: 1, kull: getKull(1, 2026),
        gruppe: "Klasse 30"
    },
    {
        name: "Krampefadder hvert år - De gamle (2025)",
        file: "/Audio/CGP_Sanger/Krampefadder hvert år.mp3",
        year: 2025, award: Pristyper[3], type: Innslagstype[0],
        grade: 6, kull: getKull(6, 2025),
        gruppe: "De gamle"
    },
    {
        name: "Oppskalere - Organisk (2025)",
        file: "/Audio/CGP_Sanger/Oppskalere.mp3",
        year: 2025, award: Pristyper[3], type: Innslagstype[1],
        grade: 0, kull: null,
        gruppe: "Organisk"
    },
    {
        name: "Re-ind-vention - Indkom (2026)",
        file: "/Audio/CGP_Sanger/Re-ind-vention.mp3",
        year: 2026, award: Pristyper[3], type: Innslagstype[1],
        grade: 0, kull: null,
        gruppe: "Indkom"
    },
    {
        name: "Studassen til Svein - Laborachorium (2025)",
        file: "/Audio/CGP_Sanger/Studassen til Svein.mp3",
        year: 2025, award: Pristyper[3], type: Innslagstype[2],
        grade: 0, kull: null,
        gruppe: "Laborachorium"
    }
];

export default songs;