// Denne koden gjør alt javascript-greier som den andre javascripten ikke gjør :) 
// Dette er de "større funksjonene" som henter verdier fra den andre javascripten (som regner ut verdier). 
// Disse funskonene laster altså inn greier
// Takk til my pookie copilot

let dice = Array.from({ length: 5 }, () => ({ value: 0, locked: false }));
let rollsLeft = 4; // etter det tredje kastet blir alle verdier låst, og det fjerde displayer '?' for å markere overgang mellom kategori - se renderDice() og rollDice()
const categories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'onePair', 'twoPair', 'threeOfAKind', 'fourOfAKind', 'smallStraight', 'largeStraight', 'fullHouse', 'chance', 'yahtzee'];
let scores = { ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0 , onePair: 0, twoPair: 0, threeOfAKind: 0, fourOfAKind: 0, smallStraight: 0, largeStraight: 0, fullHouse: 0, chance: 0, yahtzee:0}; //startverdier = 0.
let dicePictures = ['Terning1.png', 'Terning2.png', 'Terning3.png', 'Terning4.png', 'Terning5.png', 'Terning6.png']; // Brukes i renderDice() for å vise terningene som bilder
let reddicePictures = ['Terning1Red.png', 'Terning2Red.png', 'Terning3Red.png', 'Terning4Red.png', 'Terning5Red.png', 'Terning6Red.png']; // Brukes i renderDice() for å vise låste terninger som røde bilder

displayLeaderboard(); // Load in leaderboard
// Show a bold warning in the console when opened
console.info('%cThis is a browser feature intended for developers. Do not paste any code here given to you by someone else. It may annoy or saddend me if you send a fake score NOT under the name (Jukser). Good luck if you know what you are doing. Elseway PISS OFF', 'font-weight: bold;');

let usedCategories = {
    ones: false,
    twos: false,  
    threes: false,
    fours: false,
    fives: false,
    sixes: false,
    onePair: false,
    twoPair: false,
    threeOfAKind: false,
    fourOfAKind: false,
    smallStraight: false,
    largeStraight: false,
    fullHouse: false,
    chance: false,
    yahtzee: false
}

let haveChosenCategory = false; // Om en kategori er valgt, blir denne satt til true. Dette er for å hindre at du kan fortsette uten å velge en kategori.

function amountUsedCategories() {
    return Object.values(usedCategories).filter(v => v).length; // Returnerer antall brukte kategorier
}

function rollDie() {
    // return Math.floor(Math.random() * 6) + 1;
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 6) + 1;
} 

function renderDice() {
    const diceContainer = document.getElementById('dice-container');
    diceContainer.innerHTML = '';
    diceContainer.classList.remove('unclickable'); // Fjerner unclickable-klassen for å gjøre terningene klikkbare igjen

    dice.forEach((die, index) => {
        const dieDiv = document.createElement('div');
    
        dieDiv.className = 'die';

        /* Hvis du ønsker en knapp som endrer å vise terningene med bilder til å vise tall (som tvungen yatzy orginalt)
        må du (som jeg tenker) legge til en konstant, en const, WantNumbers = False. Trykker du på den blir den True, 
        da vil vil denne script koden, endre css-stylen til die ved å legge til background-image: none; og endre color til svart.
        Denne konstante verdien må sjekkes i neste if-løkke, den skal IKKE kjøre da (fordi den endrer bildene hele tiden)
        */

        if (die.value > 0 && rollsLeft !== 4) { // Hvis terningen har en verdi og det ikke er første kast
            dieDiv.style.backgroundImage = `url(/Bilder/Fri_Yatzy/${die.locked ? reddicePictures[die.value - 1] : dicePictures[die.value - 1]})`; // Bruker bilder for terningene
            dieDiv.style.backgroundSize = 'cover'; // Fyller hele terningen med bildet
        }
    
        // Hvis det er etter siste kast, gjør dem ikke-klikkbare og vis verdiene
        if (rollsLeft === 1) {
            dieDiv.textContent = die.value;
            document.getElementsByClassName('dice-container')[0].classList.add('unclickable');
            //dieDiv.classList.add('unclickable');
        }
        // Første gang før noen har kastet
        else if (rollsLeft === 4) {
            dieDiv.textContent = '?';
            dice.forEach((die) => {
                die.value = 0; // Setter alle verdier til 0 før første kast
            });
            haveChosenCategory = false; // Nullstill for neste runde
            
            possibleScores = calculateScore();
            for (let category in possibleScores) {
                if (!usedCategories[category]) {
                    showScore(category, possibleScores[category]);
            }}
        }
        // Ellers vis vanlig verdi og gjør klikkbar
        else {
            dieDiv.textContent = die.value > 0 ? die.value : '?'; //WTF dis do?
            // Kun klikkbare hvis ikke låst
            dieDiv.addEventListener('click', () => toggleLock(index));
        }
        
        /* Denne classen (.locked) blir ikke brukt i denne versjonen av Fri-Yatzy (både style.css og script.js er oppdatert for å ikke bruke denne)
        // Hvis terningen er låst, vis det med stil
        if (die.locked) {
            dieDiv.classList.add('locked');
        }
        */
        
        diceContainer.appendChild(dieDiv);
    });
}



function rollDice() {
    console.log("rolldice; rollsLeft:", rollsLeft);
    if (rollsLeft === 1 && !haveChosenCategory) {
        alert('Du må velge kategori før du fortsetter!');
        return; // Blokker videre handlinger
    }

    console.log("Før kast:", JSON.stringify(dice)); 
    if (rollsLeft > 0) {
        dice.forEach(die => {
            if (!die.locked) {
                die.value = rollDie();   
            }
        });

        rollsLeft--; // Reduser antall kast igjen
        
                
        console.log("Etter kast:", JSON.stringify(dice));
        // Oppdater poeng for hver runde
        possibleScores = calculateScore(); // Oppdaterer poengsummene basert på terningene som er kastet
        // Vis poeng for hver kategori
        for (let category in possibleScores) {
            if (!usedCategories[category]) {
                showScore(category, possibleScores[category]);
            }
        }

        if (rollsLeft === 1) { // Etter tredje kast
            dice.forEach(die => die.locked = true); // Lås verdiene
        }
        if (rollsLeft === 0) {
            prepareNextRound(); // denne regner verdien etter fjerde kast (gir mulighet for et ekstra kast, MEN se renderDice() for du kan ikke trykke på terningene (un-locke) etter tredjekast)
            console.log("rollsLeft===0")
        }
        // prepareNextRound(); fortsetter spillet om kategori er valgt, om ikke så er forblir rollsLeft 4 og terningene kan rulles igjen. (unclickable i renderDice() gjør at de ikke endres)
        // Oppdater visningen av terningene
        renderDice();

    } else {
        alert('Ingen kast igjen! Trykk på nullstill spill eller ctrl+shift+R for å starte et nytt spill! Husk å lagre poengsummen din først!');
    }
}

function toggleLock(index) { // Låser eller låser opp terningen basert på dens nåværende tilstand
    dice[index].locked = !dice[index].locked;
    console.log(`Terning ${index + 1} låst:`, dice[index].locked);
    renderDice();
}

function calculateScore() {  // Returnerer en liste (NewScores) av poengsummer for alle kategorier basert på terningene nå(r funksjonen kalles)
    const counts = Array(6).fill(0);
    dice.forEach(die => {
        if (die.value >= 1 && die.value <= 6) {
            counts[die.value - 1]++;
        }
    });

    //console.log(counts); 

    const NewScores = {
        ones: counts[0] * 1,
        twos: counts[1] * 2,
        threes: counts[2] * 3,
        fours: counts[3] * 4,
        fives: counts[4] * 5,
        sixes: counts[5] * 6, //hvordan de følgende fungerer: // true/false ? if true:if false
        onePair: counts.reduce((max, count, i) => count >= 2 ? (i + 1) * 2 : max, 0), //max fordi du skal få poeng for det høyeste paret om to par er tilstede
        twoPair: (() => { /* Finn en beskrivlse for hva denne egt gjør */
            const pairs = counts.map((c, i) => c >= 2 ? (i + 1) * 2 : 0).filter(v => v > 0); // c = antall like verdier av verdien (i+1) -> blir lagt til i et filter av en grunn?
            return pairs.length >= 2 ? pairs.sort((a,b) => b - a).slice(0,2).reduce((a,b) => a + b, 0) : 0; // om et er minst 2 par sorter deres sum (ok?) og summer
        })(),
        threeOfAKind: counts.reduce((sum, count, i) => count>= 3 ? sum + (i+1)*3 : sum, 0), //reduce gjør om verdiene til terningene til EN verdi (poenget for oppgaven)
        fourOfAKind: counts.reduce((sum, count, i) => count>= 4 ? sum + (i+1)*4 : sum, 0),
        fullHouse: (counts.includes(3) && counts.includes(2)) 
            ? counts.reduce((sum, count, i) => sum + (count > 0 ? (i + 1) * count : 0), 0) //summerer verdiene som lagres i true/false i counts.includes
            : 0, 
        smallStraight: [0, 1, 2, 3, 4].every(i => counts[i] > 0) ? 15 : 0,
        largeStraight: [1, 2, 3, 4, 5].every(i => counts[i] > 0) ? 20 : 0,
        yahtzee: counts.includes(5) ? 50 : 0, //+50 if true, +0 if false
        chance: dice.reduce((sum, die) => sum + die.value, 0) //summer opp uansett verdier
    };
    return NewScores;
}

let possibleScores = calculateScore(); // Denne funksjonen regner ut verdiene for hver oppgave, og returnerer et objekt med alle verdiene.

for (let category in possibleScores) {
  if (!usedCategories[category]) {
    showScore(category, possibleScores[category]);
  }
}

function onCategoryChosen(category) {
    // Registrer score
    console.log('haveChosenCategory:', haveChosenCategory)
    if (haveChosenCategory) {
        alert("Du har allerede valgt en kategori! Rull terningene eller nullstill spillet.");
        return; // Blokker videre handlinger
    }

    haveChosenCategory = true; // Vi har valgt en kategori
    usedCategories[category] = true;

    console.log("Kategori:", category);
    console.log("Terninger under poengberegning:", JSON.stringify(dice));

    // **Lagre verdiene FØR de nullstilles** **************************************************** Her er hvordan det innsendte (til arket) vil se ut. evt. endre gamelog? - se "tvungen"-yatzy
    let counts = calculateScore();
    gameLog.push({
        categoryChosen: category,
        diceValues: dice.map(die => die.value),
        score: counts[category]
    });
    scores[category] = counts[category]; // Lagre poeng for valgt kategori

    console.log(`Category: ${category}, Counts: ${counts}, Score: ${scores[category]}`);

    // Vis poeng i sort (låst inn)
    const scoreField = document.getElementById(`score-${category}`);
    scoreField.style.color = 'black';
    scoreField.style.fontStyle = 'italic';

    // Bytt ut ⭕ med ✅, and disable further clicks
    const checkCell = document.getElementById(`score-${category}-check`);
    if (checkCell) {
        checkCell.textContent = '✅';
        checkCell.style.cursor = 'default';
        checkCell.onclick = null; // Fjern klikk-hendelse for å hindre videre valg (på denne kategorien)
        console.log("haveChosenCategory (JA):", haveChosenCategory)
    }

    // Gå videre
    if (amountUsedCategories() === categories.length) { // Hvis alle kategorier er brukt
        console.log("Alle kategorier er brukt, avslutter spillet.");
        endGame();
    } else {
        prepareNextRound(); 
    }
}

function showScore(category, score) {
    // Oppdater poeng i rødt

    const scoreField = document.getElementById(`score-${category}`);
    console.log('showScore')

    if (haveChosenCategory || rollsLeft===4) { // Fjerner poengsvisning om en kategori allerede er valgt, foreløpig registrerer denne bare rollsLeft===4
        scoreField.textContent = '-'; // Hvis en kategori allerede er valgt, vis '-'
        scoreField.style.color = 'black'; // Gjør den svart
        scoreField.style.fontStyle = 'normal'; // Fjern kursiv
        for (const cat of categories) { // Fjerner muligheten for å trykke på en ny kategori når en allerede er valgt for kastet
            const Cellcheck = document.getElementById(`score-${cat}-check`);
            if (Cellcheck) {
                Cellcheck.style.cursor = 'default';
                Cellcheck.onclick = null;
            }
        }
        return; // Hvis en kategori allerede er valgt, gjør ingenting mer
    }

    if (scoreField) {
        scoreField.textContent = `${score}`;
        scoreField.style.color = 'red';
    }

    // Oppdater "⭕"-knapp
    const checkCell = document.getElementById(`score-${category}-check`);

    // Hvis ikke brukt, vis ny ⭕ og legg til klikk
    if (!usedCategories[category]) {
        if (checkCell) {
            checkCell.textContent = '⭕';
            checkCell.style.cursor = 'pointer';
            checkCell.onclick = () => onCategoryChosen(category);
            //Once a category is chosen, everyone else is unclickable until next roll
        }
    }
}

function endGame() {
    // Når alle kategorier er brukt, vis total poengsum
    rollsLeft = 0; // Blokker flere kast
    bonusCheck(); // Om det siste kaste brukes på en av de øvre kategoriene, vil ikke prepareNextRound() bli kalt, og bonusCheck(); VISER sum1 og bonus
    const rulleknapp = document.getElementById('roll-button')
    if (rulleknapp) {
        rulleknapp.disabled = true; // Deaktiver rull-knappen
    }
    console.log("scores:", scores);
    let total = Object.values(scores).reduce((a, b) => a + b, 0) + bonusCheck(); // calculateUpperTotal is the bonus value.
    document.getElementById('score-total2').textContent = total;
    document.getElementById('score-total2').style.color = 'black'; // Gjør totalen svart
}

function prepareNextRound() {
    //haveChosenCategory = false; // Må være i renderdice+rollsLeft===4 for at onCetegoryChosen ikke skal gå i loop som kan samle opp poeng
    // Nullstill terningene for neste runde
    dice.forEach(die => { die.value = 0; die.locked = false; });
    rollsLeft = 4; // Nullstill kast-telleren
    renderDice(); // Oppdater visningen av terningene ********************* Er dette nødvendig? 
    // Sjekk om summen av første seks kategorier er 42 eller mer
    // Om de seks første kategoriene er brukt, regner vi ut totalen
    bonusCheck();
    // Sjekker hvor lenge det er igjen av spillet
    checkCategoriesleft();
}

function bonusCheck() { // Returns bonus value and/or alters "oppgaver-ramme" live
    // !!!!!! Returns BONUS VALUE - endGame() calculates end-sum and calls bonusCheck for bonus value. 
    // IF NOT CALLED BY endGame(), IT CHANGES THE "STATUS" OF score-total1 and bonus in the html (visualized on the website)

    // If usedCategories is true for the first six categories, return the sum of the first six categories
    let upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    document.getElementById('score-total1').textContent = upperCategories.reduce((sum, cat) => sum + scores[cat], 0);
    // Vis poengsummen for de øvre kategoriene med en annen stil (f.eks. grå og kursiv) for å indikere at den er "foreløpig"
    const total1Check = document.getElementById('score-total1');
    total1Check.style.color = 'green';
    total1Check.style.fontStyle = 'italic';

    // Underveis vises en grønn '+50' om du har nådd nok poengsum for bonus
    document.getElementById('bonus').textContent = upperCategories.reduce((sum, cat) => sum + scores[cat], 0) >= 42 ? '+50' : '-';
    document.getElementById('bonus').style.color = 'green';
    document.getElementById('bonus-check').textContent = upperCategories.reduce((sum, cat) => sum + scores[cat], 0) >= 42 ? '✅' : '❌';

    if (upperCategories.every(cat => usedCategories[cat])) {
        document.getElementById('bonus').textContent = upperCategories.reduce((sum, cat) => sum + scores[cat], 0) >= 42 ? '+50' : '0'; // Eneste forskjell er '0' istedenfor '-' i linje 304
        document.getElementById('score-total1').style.color = 'black';
        document.getElementById('bonus').style.color = 'black';
        if (upperCategories.reduce((sum, cat) => sum + scores[cat], 0) >= 42) { //This line alone is the other yatzy's "caltulateUpperTotal function"
            console.log("Bonus = 50")
            return 50; // These two return are for endGame() calculations of score-total2 (poengsum)
        } else {
            console.log("Bonus = 0")
            return 0;
        }
    }
    console.log("Game not over, Bonus = 0")
    return 0; // Return 0 if not all upper categories are used
}

const gameLog = []

function checkCategoriesleft() { // Tror koden funker uten denne, men siden koden funker nå så antar jeg at jeg skal beholde denne 
    let amountUsed = amountUsedCategories(); // Antall brukte kategorier
    if (amountUsed < categories.length) { // < 15
        // **Nå kan vi nullstille terningene**
        dice.forEach(die => { die.value = 0; die.locked = false; });
        renderDice();

        if (amountUsed < categories.length) {
            rollsLeft = 4;  // Nullstill kast-telleren for neste oppgave
            console.log("rollsLeft:", rollsLeft);
        } if (amountUsed === categories.length) { // Hvis alle kategorier er brukt
            console.log("Alle kategorier er brukt, avslutter spillet.");
            endGame();  // **Blokker flere kast etter siste kategori**
        }
    }
}

// Kjører etter et spill
function resetGame() { // Resets everything (needed)
    dice = Array.from({ length: 5 }, () => ({ value: 0, locked: false }));
    rollsLeft = 4;
    currentCategory = 0;
    scores = scores = { ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0, onePair: 0, twoPair: 0, threeOfAKind: 0, fourOfAKind: 0, smallStraight: 0, largeStraight: 0, fullHouse: 0, chance: 0, yahtzee: 0 };
    //under '?' har terningene verdien 0
    categories.forEach(cat => document.getElementById(`score-${cat}`).textContent = '-');
    document.getElementById('score-total1').textContent = '-';
    document.getElementById('bonus').textContent = '-';
    document.getElementById('score-total2').textContent = '-';
    // Reset usedCategories
    for (let category in usedCategories) {
        usedCategories[category] = false;
    }
    // Reset the checkmarks
    categories.forEach(cat => {
        const checkElem = document.getElementById(`score-${cat}-check`);
        if (checkElem) {
            checkElem.textContent = '⭕'; // Reset to ⭕
            checkElem.style.cursor = 'pointer';
        }
    });
    const bonusCheckElem = document.getElementById('bonus-check');
    if (bonusCheckElem) {
        bonusCheckElem.textContent = '❌'; // Reset bonus checkmark
    }
    // Reset the game log
    gameLog.length = 0;
    scoreSaved = false;
    renderDice();
    //displayLeaderboard();
}

let scoreSaved = false; //skal sørge for at du bare kan sende inn EN saveScore per spill. Noe som nullstilles i resetGame()
function saveScore() { //jeg vet at denne ikke er så vakker. Men den går VELDIG steg for steg så i like it.
    if (scoreSaved) {
        alert("Du kan bare lagre én gang per spill!");
        return;
    }

    let score = parseInt(document.getElementById('score-total2').textContent);
    
    if (isNaN(score)) { // NaN = not a number
        alert("Du har ikke en Poengsum! Spill spillet ferdig først.");
        return;
    }

    let name = prompt("Skriv inn deres navn, blir det for langt korter jeg det ned til den grønne ledertavlen:");
    if (!name) return; //if prompt is empty, cancel saveScore. 
    if (!confirm(`Er du sikker på at du vil sende inn poengsummen ${score} som ${name}?`)) return; //spør deg om du faktisk vil lagre poengskåren

    console.log("Saving data locally:", { name: name, score: score }); // Debug
    

    // Get existing leaderboard from localStorage
    // Use a unique key for each leaderboard
    const leaderboardKey = `PB-leaderboard-FREE-YATZY`; // or use user ID, etc.
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

    // Add new score
    leaderboard.push({ name, score });

    // Sort leaderboard by score (descending order)
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top 5 scores
    leaderboard = leaderboard.slice(0, 5);

    // Save back to localStorage
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    let now = new Date();
    let dateTime = `${now.toLocaleString()}:${Math.floor(now.getMilliseconds() / 100)}`; 

    // Convert gameLog to JSON string
    let gameLogString = JSON.stringify(gameLog);
    let gameId = "Fri_Yatzy";

    // First form submission
    let formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeQJsaAQOwBi12_-No7XyQjP8YbcUQ_fjyFoDuIoAax8TMd1w/formResponse'; 
    let formData1 = new FormData();
    formData1.append('entry.702680592', name); // Name field entry ID
    formData1.append('entry.1831981383', score); // Score field entry ID
    formData1.append('entry.2106877697', gameLogString); // Time field entry ID
    formData1.append('entry.1680430153', gameId); // Game ID field entry ID (8data-fieldid)
    formData1.append('entry.1502945716', dateTime); // Time field entry ID (8data-fieldid)

    fetch(formURL, {
        method: 'POST',
        body: formData1,
        mode: 'no-cors'
    }).then(() => {
        console.log("Data submitted to Google Forms");
    }).catch(error => console.error("Error submitting data to Form:", error));

    scoreSaved = true;
    alert('Poengsum lagret!')
    displayLeaderboard(); // Update leaderboard **** (noe jeg må fikse her, men jeg husker ikke og vet ikke hva)
}

function getLeaderboard() {
    const leaderboardKey = `PB-leaderboard-FREE-YATZY`; // or use user ID, etc.
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    if (!leaderboard) {
        // Hvis ledertavlen ikke finnes, returner en tom liste
        return [];
    }
    return leaderboard;
}

// displayLeaderboard: når noen velger å legge seg til i ledertavlen (og det er færre enn 5 i tavla) vil denne func generere et par linjer med kode: "let html=.."
function displayLeaderboard() {
    console.log("Trying to Display Leaderboard")
    let leaderboard = getLeaderboard();
    let html = "<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
    leaderboard.forEach((entry, index) => {
        html += `<tr><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
    });
    html += "</table>";
    // Hvis ledertavlen er tom, vis en melding
    if (leaderboard.length === 0) {
        console.log("Ledertavlen er tom!")
        html += "<tr><td colspan='3'>Ingen poengsummer tilgjengelig</td></tr>";
    }                                                                      
    
    document.getElementById("leaderboard-PB").innerHTML = html;
}

function visRegler(event) {
    event.preventDefault();
    document.getElementById("regelboks").style.display = "block";
}
function skjulRegler(){
    document.getElementById('regelboks').style.display = "none";
}

//setInterval(loadLeaderboard, 10000); //oppdaterer ledertavlen hvert 10. sekund
document.querySelectorAll('.roll-button').forEach((button) => {
    button.addEventListener('click', rollDice); // når du trykket på "roll-button" = "Rull terninger" så: "rollDice"
});
document.querySelectorAll('.reset-button').forEach((button) => {
    button.addEventListener('click', resetGame); // når du trykket på "roll-button" = "Rull terninger" så: "rollDice"
});
/* De over er for class="roll-button" og class="reset-button", de under er for id="roll-button" og id="reset-button"
document.getElementById('roll-button').addEventListener('click', rollDice); // når du trykket på "roll-button" = "Rull terninger" så: "rollDice"
document.getElementById('reset-button').addEventListener('click', resetGame);
*/

// document.getElementById('lagre-poeng').addEventListener('click', saveScore); not used, changed from id to class due to multiple saveScore buttons

document.querySelectorAll('.lagre-poeng').forEach((button) => {
    button.addEventListener('click', saveScore); // når du trykket på "lagre-poeng" = "Lagre poeng" så: "saveScore"
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'k' || event.key === 'K' || event.key === 'd' || event.key === 'D') {
    rollDice();
    const KastBtn = document.getElementById('kast-Terningene');
    if (KastBtn) {
      KastBtn.onclick(); /* Registrerer onclick på Kast Terningene (roll-button) slikat den viser animasjonen (rotate(360deg)) */
    }
  }
});
document.addEventListener('keydown', function(event) {
  if (event.key === 'n' || event.key === 'N' || event.key === 'a' || event.key === 'A') {
    resetGame();
    const NullBtn = document.getElementById('nullstill-spill');
    if (NullBtn) {
      NullBtn.onclick(); /* Registrerer onclick på Nullstill spill (reset-button) slikat den viser animasjonen (rotate(360deg)) */
    }
  }
});
document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key >= '1' && key <= '5') {
    if (rollsLeft !== 4) {
      const index = parseInt(key) - 1;
      toggleLock(index);
    }
  }
});

// Når siden lastes, vis terningene og ledertavlen
//så : renderDice()
renderDice();
displayLeaderboard(); /*Dette er dine PERSONLIGE BESTE*/