/*
TODO

1. Lage en dropdown-filtreringsystem | kok fra per?
2. Gjøre at man kan huke av "favoritt" (en stjerneemoji) og at man kan sortere etter favoritter
    >>> Sortere etter avspillinger?
    >>> "Legg til i favoritt" : Trykk på en knapp for å shuffleplaye "favoritt"-spilelisten DIN (lagret som liste i LocalStorage)
3. Laste opp alle sangene 
4. Legg til sangtekstene


*/

import songs from "./songs.js";
const playlist = songs.map(song => song.file);
const songNames = songs.map(song => song.name); //så jeg slipper å skrive om hele koden.

const audio = document.getElementById("myAudio");
const audioSource = document.getElementById("audioSource");

const avspillinger = [];


function lagreAvspillinger(sang) {
    /*
    Hver gang det trykkes "spill" vil denne får +1 avspillinger | ikke superbra men veldig enkelt
    */
    const dataKey = "Avspillinger_for_CGP_sanger";

    // Hent eksisterende data, eller start med en tom liste
    let avspillinger = JSON.parse(
        localStorage.getItem(dataKey) || "[]"
    );

    // Finn sangen i listen
    const eksisterendeSang = avspillinger.find(
        entry => entry.sang === sang
    );

    if (eksisterendeSang) {
        // legg til +1 avspilling
        eksisterendeSang.tall += 1;
    } else {
        // Ny sang: opprett oppføring
        avspillinger.push({
            sang: sang,
            tall: 1
        });
    }

    // Lagre oppdatert liste
    localStorage.setItem(dataKey, JSON.stringify(avspillinger));
    oppdaterAvspillinger(sang); //oppdaterer de live, fordi playThis() kaller på lagreAvspillinger, som igjen kaller på oppdaterAvspillinger()
}

function getAvspillinger(sang) { //nesten en kopi av lagreAvspillinger(), denne bare henter tallet for avspillinger for å vise i html
    const dataKey = "Avspillinger_for_CGP_sanger";

    // Hent eksisterende data, eller start med en tom liste
    let avspillinger = JSON.parse(
        localStorage.getItem(dataKey) || "[]"
    );

    // Finn sangen i listen
    const eksisterendeSang = avspillinger.find(
        entry => entry.sang === sang
    );

    if (eksisterendeSang) {
        return eksisterendeSang.tall;
    } else {
        console.info("Klarte ikke å hante avspillinger for sang:", sang); //dukker også opp for sanger med avspilling=0 ved reload av vindu 
        return 0;
    }
}

function oppdaterAvspillinger(song) { //oppdaterer de live
    document.querySelectorAll(".antallAvspillinger")
        .forEach(element => {
            if (element.dataset.song === song) {
                element.textContent =
                    `${getAvspillinger(song)} avspillinger`;
            }
        });
}

const uniqueYears = [...new Set(
    Object.values(songs).map(liste => liste[0])
)].sort((a, b) => b - a);
console.debug(uniqueYears)

const favorites = [] 

function displayDropdown(id, values) {
    const dropdown = document.getElementById(id);

    const uniqueValues = [...new Set(values)]
        .filter(value => value != null && value !== "NaN")
        .sort((a, b) => {
            if (typeof a === "number") return a - b;
            return String(a).localeCompare(String(b), "no");
        });

    uniqueValues.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

// Fyll dropdowns direkte fra songs
displayDropdown("år", songs.map(s => s.year));
displayDropdown("innslagstype", songs.map(s => s.type));
displayDropdown("awardtype", songs.map(s => s.award));
displayDropdown("klassetrinn", songs.map(s => s.grade));
displayDropdown("klasseXX", songs.map(s => s.kull));


function getFilteredSongs() {
    const year = document.getElementById("år").value;
    const type = document.getElementById("innslagstype").value;
    const award = document.getElementById("awardtype").value;
    const grade = document.getElementById("klassetrinn").value;
    const kull = document.getElementById("klasseXX").value;

    return songs
        .map((song, index) => ({ song, index }))
        .filter(({ song }) => {
            return (
                (year === "default" || String(song.year) === year) &&
                (type === "default" || song.type === type) &&
                (award === "default" || song.award === award) &&
                (grade === "default" || String(song.grade) === grade) &&
                (kull === "default" || song.kull === kull)
            );
        });
}

let playSortDirection = 0; //ingen sortering
function sortSongs(songs) {

    if (playSortDirection === 1) {
        return songs.sort((a, b) =>
            getAvspillinger(songNames[b.index]) -
            getAvspillinger(songNames[a.index])
        );
    }

    if (playSortDirection === 2) {
        return songs.sort((a, b) =>
            getAvspillinger(songNames[a.index]) -
            getAvspillinger(songNames[b.index])
        );
    }

    return songs;
}
function updateSongDisplay() {
    let songs = getFilteredSongs();
    songs = sortSongs(songs);

    displaySongs(
        "Sangutvalg",
        songs.map(item => item.index)
    );
}
["år","innslagstype","awardtype","klassetrinn","klasseXX"].forEach(id => {
    document.getElementById(id).addEventListener("change", updateSongDisplay);
});

updateSongDisplay();
/* 
Gjøre at man kan markere visse sanger med en stjerne
for å favorisere? 
Lagres i LocalStorage og kan sortere!!!!
*/

function displaySongs(div_ID, indices = songs.map((_, i) => i)) {
    const utvalg = document.getElementById(div_ID);

    if (!utvalg) {
        console.error("Klarte ikke å hente sangutvalg");
        return;
    }

    utvalg.innerHTML = "";

    indices.forEach(index => {
        const song = songs[index];

        const row = document.createElement("div");
        row.className = "SangRad";
        row.dataset.song = index;

        // Sangnavn
        const title = document.createElement("span");
        title.className = "line";
        title.textContent = song.name;

        // Antall avspillinger
        const avspillinger = document.createElement("span");
        avspillinger.className = "antallAvspillinger";
        avspillinger.dataset.song = song.name;
        avspillinger.textContent =
            `${getAvspillinger(song.name)} avspillinger`;

        // Spill-knapp
        const button = document.createElement("button");
        button.type = "button";
        button.className = "PlayThisSongButton playbutton";
        button.textContent = "Spill";
        button.title = `Spill ${song.name}`;
        button.addEventListener("click", () => playThis(index));

        // Kø-knapp
        const playnext = document.createElement("button");
        playnext.type = "button";
        playnext.className = "PlayThisSongButton playnext";
        playnext.textContent = "Legg til i kø";
        playnext.addEventListener("click", () => addToQueue(index));

        const songInfo = document.createElement("div");
        songInfo.className = "songInfo";
        songInfo.append(title, avspillinger);

        const songButtons = document.createElement("div");
        songButtons.className = "play_or_next";
        songButtons.append(button, playnext);

        row.append(songInfo, songButtons);
        utvalg.appendChild(row);
    });
}
displaySongs("Sangutvalg");

function setPlayingRow(songIndex) {
    document.querySelectorAll(".SangRad").forEach(row => {
        row.classList.remove("playing");

        // Finn raden som tilhører sangindeksen
        if (Number(row.dataset.song) === songIndex) {
            row.classList.add("playing");
        }
    });
}

let currentSong = Math.floor(Math.random() * playlist.length); //Starter med en random sang, med mindre du velger. Se også kommentaren til windows.onload funksjonen.

async function playCurrentSong() {
    const song = songs[currentSong];

    //Oppdater info fra avspillingskonsoll
    updateMediaSession(song);
    
    audioSource.src = song.file;
    audio.load();


    // Registrer avspillingen
    lagreAvspillinger(song.name);

    // Oppdater navnet på sangen som spilles
    const SangNavn = document.getElementById("SongName");

    if (!SangNavn) {
        console.error("Klarte ikke å vise SangNavn");
    } else {
        SangNavn.innerText = song.name;
    }

    // Start avspillingen
    try {
        await audio.play();
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("Kunne ikke spille av sangen:", error);
        }
    }
}

function playAudio() {
    if (audio.paused) {
        audio.play();
    }
}

function pauseAudio() {
    audio.pause();
}

function updateStatus() {
    console.log("Audio status updated: " + (audio.paused ? "paused" : "playing"));
    if (audio.paused) {
        document.getElementById("toggleplayButton").src = "/Bilder/NoSound.svg"; // Set pause button icon
    } else {
        document.getElementById("toggleplayButton").src = "/Bilder/PlayingSong.svg"; // Set play button icon
        console.log("Playing song: " + playlist[currentSong]);
    }
}

// Spill neste sang automatisk
audio.onended = function () {
    if (playNextQueuedSong()) {
        return;
    }

    // Ingen sanger i køen:
    // Fortsett den vanlige spillelisten.
    nextSong();
};

// Toggle play/pause for the audio element when the image is clicked
function togglePlay() {
    // Hvis audio er på, så pause
    if (audio.paused) {
        playAudio();
        document.getElementById("toggleplayButton").src = "/Bilder/PlayingSong.svg"; // Set play button icon
    } else { // Hvis audio er av, så spill
        pauseAudio();
        document.getElementById("toggleplayButton").src = "/Bilder/NoSound.svg"; // Set pause button icon
    }
}

// Bytt til neste sang når knappen klikkes
function nextSong() {
    if (playNextQueuedSong()) { //Denne sjekker om køen er tom, hvis ja; spille neste sang, ellers; random. 
        return; //Kan optimaliseres fordi nextSong() og playNextQueuedSong() gjør egt det samme, bare en spiller tilfeldig og en annen spiller neste sang.
    }
    //currentSong = (currentSong + 1) % playlist.length; // looper tilbake
    currentSong = Math.floor(Math.random() * playlist.length);
    setPlayingRow(currentSong);
    playCurrentSong();
    document.getElementById("toggleplayButton").src = "/Bilder/PlayingSong.svg"; // Set play button icon
}

function playThis(song) {
    if (song < 0 || song >= playlist.length) {
        console.error("Ugyldig sangindeks:", song);
        return;
    }
    //lagreAvspillinger(songNames[song]); // +1 avspilling  //blir gjort i playcurrentsong for at den skal også funke for sanger i køen
    currentSong = song;
    setPlayingRow(song);
    playCurrentSong();    
}

document.getElementById("toggleplayButton")
    .addEventListener("click", togglePlay);

document.getElementById("nextSongButton")
    .addEventListener("click", function () {
        nextSong();

        this.style.transform = "translateX(10px)";
        setTimeout(() => {
            this.style.transform = "";
        }, 300);
    });

audio.onplay = updateStatus;
audio.onpause = updateStatus;
// Auto-start musikk ved lasting av siden
/*window.onload = function () {
    playCurrentSong();
};*/ //google elns har oppdatert sin "sikkerhet" som gjør at musikk ikke kan spilles av automatisk

//Spillekø
let songQueue = [];

function addToQueue(songIndex) { //Jobber med indexen siden der er sånn playcurrentsong funker
    /*
    Pass på funksjonalitet med audio.onended - den må sjekke om Queue er tom
    */
    if (
        !Number.isInteger(songIndex) ||
        songIndex < 0 ||
        songIndex >= playlist.length
    ) {
        console.error("Ugyldig sangindeks:", songIndex);
        return;
    }

    songQueue.push(songIndex);
    renderQueue();
}

function renderQueue() { //eneste gjør er å displaye køen
    const queueElement = document.getElementById("SongQueue");
    queueElement.replaceChildren();
    if (songQueue.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "Køen er tom... velger en tilfeldig sang";
        queueElement.appendChild(emptyMessage);
        return;
    }
    
    songQueue.forEach((songIndex, queueIndex) => { //disse må få sin egen styling for at folk skal skjønne at de er LAGT TIL i KØEN
        const item = document.createElement("li");
        const name = document.createElement("span");
        const removeButton = document.createElement("button");

        name.textContent =
            `${queueIndex + 1}. ${songNames[songIndex]}`;

        removeButton.textContent = "Fjern";
        removeButton.type = "button";
        removeButton.className = "RemoveFromQueue"
        removeButton.addEventListener("click", () => {
            songQueue.splice(queueIndex, 1);
            renderQueue();
        });

        item.append(name, " ", removeButton);
        queueElement.appendChild(item);
    });
}

function playNextQueuedSong() {
    if (songQueue.length === 0) {
        return false;
    }

    currentSong = songQueue.shift();
    renderQueue();


    setPlayingRow(currentSong);
    playCurrentSong();

    return true;
}

document.getElementById("ClearQueue").addEventListener("click", () => {
    songQueue = [];
    renderQueue();
});

//PROGRESJONSBAR laget av AI
const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

// Gjør sekunder om til formatet minutter:sekunder
function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Oppdater tidsvisningen når sangens metadata er lastet
audio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(audio.duration);
});

// Oppdater progresjonsbaren mens sangen spiller
audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progressBar.value = (audio.currentTime / audio.duration) * 1000;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        durationDisplay.textContent = formatTime(audio.duration);
    }
});

// La brukeren hoppe til et annet tidspunkt
progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        const percentage = Number(progressBar.value) / 1000;
        audio.currentTime = percentage * audio.duration;

        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
});

document.getElementById("nullstillFilter").addEventListener("click", () => {

    // Nullstill alle dropdowns
    ["år", "innslagstype", "awardtype", "klassetrinn", "klasseXX"]
        .forEach(id => {
            document.getElementById(id).value = "default";
        });

    // Nullstill sortering
    playSortDirection = 0;

    // Oppdater sanglisten
    updateSongDisplay();
});



// Noe chat prøver: å få en bedre avspillings-konsoll
if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: songs[currentSong].name,
        artist: songs[currentSong].gruppe,
        album: "Andrhska Folkeside"
    });

    navigator.mediaSession.setActionHandler("play", () => {
        playAudio();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
        pauseAudio();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
        nextSong();
    });
}

function updateMediaSession(song) {
    if (!("mediaSession" in navigator)) {
        console.log("Media Session støttes ikke");
        return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.gruppe,
        album: "Andrhska Folkeside"
    });
       
    console.log("Oppdatert Media Session:", {
        title: navigator.mediaSession.metadata.title,
        artist: navigator.mediaSession.metadata.artist
    });

}