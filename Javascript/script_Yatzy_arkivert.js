// Denne koden gjør alt javascript-greier som den andre javascripten ikke gjør :) 
// Dette er de "større funksjonene" som henter verdier fra den andre javascripten (som regner ut verdier). 
// Disse funskonene laster altså inn greier
//Takk til chat som hjalp med med koden (jeg gjorde en del selv, source: trust me bro)

let dice = Array.from({ length: 5 }, () => ({ value: 0, locked: false }));
let rollsLeft = 4; // etter det tredje kastet blir alle verdier låst, og det fjerde displayer '?' for å markere overgang mellom kategori - se renderDice() og rollDice()
let currentCategory = 0;
const categories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'onePair', 'twoPair', 'threeOfAKind', 'fourOfAKind', 'smallStraight', 'largeStraight', 'fullHouse', 'chance', 'yahtzee'];
let scores = { ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0 , onePair: 0, twoPair: 0, threeOfAKind: 0, fourOfAKind: 0, smallStraight: 0, largeStraight: 0, fullHouse: 0, chance: 0, yahtzee:0}; //startverdier = 0.
console.info('%cThis is a browser feature intended for developers. Do not paste any code here given to you by someone else. It may annoy or saddend me if you send a fake score NOT under the name (Jukser). Good luck if you know what you are doing. Elseway PISS OFF', 'font-weight: bold;');

function rollDie() {
    // return Math.floor(Math.random() * 6) + 1;
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 6) + 1;
} 


function renderDice() {
    const diceContainer = document.getElementById('dice-container');
    diceContainer.innerHTML = ''; 

    /* Forklaring av Copilot på linje 22 + linje 40-42:

    Dette sletter alle terning-divs (dieDiv) fra DOM-en.
    Når du så lager nye terning-divs i loopen, starter de uten klassen unclickable
    (med mindre du legger den til igjen for rollsLeft === 1). 
    
    Klassen unclickable "forsvinner" automatisk fordi du sletter og lager nye divs hver gang du kaller renderDice().
    
    Du trenger ikke å bruke classList.remove('unclickable') på denne versjonen (som i Fri-yatzy), fordi du aldri gjenbruker de gamle divs.*/

    dice.forEach((die, index) => {
        const dieDiv = document.createElement('div');
    
        dieDiv.className = 'die';
    
        // Hvis det er etter siste kast, gjør dem ikke-klikkbare og vis verdiene
        if (rollsLeft === 1) {
            dieDiv.textContent = die.value;
            dieDiv.classList.add('unclickable'); // Gjør terningen ikke-klikkbar, men hvordan blir det opphevet? se linje 22
        }
        // Første gang før noen har kastet
        else if (rollsLeft === 4) {
            dieDiv.textContent = '?'; 
        }
        // Ellers vis vanlig verdi og gjør klikkbar
        else {
            dieDiv.textContent = die.value > 0 ? die.value : '?'; //WTF dis do?
            // Kun klikkbare hvis ikke låst
            dieDiv.addEventListener('click', () => toggleLock(index));
        }
    
        // Hvis terningen er låst, vis det med stil
        if (die.locked) {
            dieDiv.classList.add('locked');
        }
    
        diceContainer.appendChild(dieDiv);
    });
}


function rollDice() {
    console.log("Før kast:", JSON.stringify(dice)); 

    if (rollsLeft > 0) {
        dice.forEach(die => {
            if (!die.locked) {
                die.value = rollDie();   
            }
        });

        rollsLeft--;
        console.log("Etter kast:", JSON.stringify(dice));

        if (rollsLeft === 1) { // Etter tredje kast
            dice.forEach(die => die.locked = true); // Lås verdiene
        }
        if (rollsLeft === 0) {
            updateScores(); // denne regner verdien etter fjerde kast (gir mulighet for et ekstra kast, MEN se renderDice() for du kan ikke trykke på terningene (un-locke) etter tredjekast)
            console.log("rollsLeft===0")
        }
        renderDice();
    } else {
        alert('Ingen kast igjen! Trykk på nullstill spill eller ctrl+shift+R for å starte et nytt spill! Husk å lagre poengsummen, hvis den er god nok!');
    }
}


function toggleLock(index) {
    dice[index].locked = !dice[index].locked;
    console.log(`Terning ${index + 1} låst:`, dice[index].locked);
    renderDice();
}

function calculateScore() { 
    const counts = Array(6).fill(0);
    dice.forEach(die => {
        if (die.value >= 1 && die.value <= 6) {
            counts[die.value - 1]++;
        }
    });

    console.log(counts); 

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

const gameLog = []

function updateScores() {
    if (currentCategory < categories.length) {
        console.log("Kategori:", categories[currentCategory]); 
        console.log("Terninger før poengberegning:", JSON.stringify(dice));

        // **Lagre verdiene FØR de nullstilles**
        let counts = calculateScore();
        gameLog.push({
            category: categories[currentCategory],
            diceValues: dice.map(die => die.value)
        });
        let category = categories[currentCategory];
        scores[category] = counts[category];

        console.log(`Category: ${category}, Counts: ${counts}, Score: ${scores[category]}`);
        document.getElementById(`score-${category}`).textContent = scores[category];
        
        // **Nå kan vi nullstille terningene**
        dice.forEach(die => { die.value = 0; die.locked = false; });
        renderDice();

        if (categories[currentCategory] === 'sixes') { //dette skjer når du starter på "Et par" kategorien, altså RETT etter du har kastet det tredje kastet i "Seksere"
            let total = Object.values(scores).reduce((a, b) => a + b, 0); //henter verdien for første sum
            document.getElementById('score-total1').textContent = total;
            if (total >= 42) {
                total +=50
                document.getElementById('bonus').textContent = '+50'
            } else {
                document.getElementById('bonus').textContent = 0
            }
        }
        
        currentCategory++; 

        if (currentCategory < categories.length) {
            rollsLeft = 4;  // Nullstill kast-telleren for neste oppgave
            if (currentCategory === 'yahtzee') {
            rollsLeft = 3
        }
        } else {
            rollsLeft = 0;  // **Blokker flere kast etter siste kategori**
        }

        if (currentCategory === categories.length) {
            let total = Object.values(scores).reduce((a, b) => a + b, 0);  //henter verdien heeelt til slutt      
            let sum1 = calculateUpperTotal()
            if (sum1 >=42) {
                document.getElementById('score-total2').textContent = total+50;
            } else {
                document.getElementById('score-total2').textContent = total;
            }
        }
    }

}

function calculateUpperTotal() {
    return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes']
        .map(cat => scores[cat])
        .reduce((a, b) => a + b, 0);
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
    const leaderboardKey = 'PB-leaderboard-TVUNGEN-YATZY'; // or use user ID, etc.
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

    // Add new score
    leaderboard.push({ name, score });

    // Sort leaderboard by score (descending order)
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top 5 scores
    leaderboard = leaderboard.slice(0, 5);

    // Save back to localStorage
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    // ✅ Submit to Google Forms
    let now = new Date(); 
    let dateTime = `${now.toLocaleString()}:${Math.floor(now.getMilliseconds() / 100)}`;

    // Step 1: Convert gameLog to JSON string
    let gameLogString = JSON.stringify(gameLog);
    let gameId = "Tvungen_Yatzy";

    // 👉 First form submission
    let formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeQJsaAQOwBi12_-No7XyQjP8YbcUQ_fjyFoDuIoAax8TMd1w/formResponse'; 
    let formData1 = new FormData();
    formData1.append('entry.702680592', name); // Name field entry ID (8data-fieldid)
    formData1.append('entry.1831981383', score); // Score field entry ID (8data-fieldid)
    formData1.append('entry.2106877697', gameLogString); // Time field entry ID (8data-fieldid)
    formData1.append('entry.1680430153', gameId); // Game ID field entry ID (8data-fieldid) 
    formData1.append('entry.1502945716', dateTime); // Time field entry ID (8data-fieldid)
    
    fetch(formURL, {
        method: 'POST',
        body: formData1,
        mode: 'no-cors'
    }).then(() => {
        console.log("Data submitted to Google Forms 1");
    }).catch(error => console.error("Error submitting data to Form 1:", error));

    scoreSaved = true;
    alert('Poengsum lagret!')
    displayLeaderboard(); // Update leaderboard *************************** (noe jeg må fikse her, men jeg husker ikke og vet ikke hva)
}

function getLeaderboard() {
    // ENDRER NAVNET PÅ LOCALSTORAGE FOR FREMTIDIG HENTING AV DATA FRA LOCALSTORAGE, 
    // if key with 'leaderboard' exist, swap names
    const oldKey = 'leaderboard';
    const newKey = 'PB-leaderboard-TVUNGEN-YATZY'; 
    // 1. Hent verdien
    const value = localStorage.getItem(oldKey);
    if (value) {
        localStorage.setItem(newKey, value);
        localStorage.removeItem(oldKey);
        return JSON.parse(value) || [];
    } else {
        return JSON.parse(localStorage.getItem(newKey)) || [];
    }
}

// displayLeaderboard: når noen velger å legge seg til i ledertavlen (og det er færre enn 5 i tavla) vil denne func generere et par linjer med kode: "let html=.."
function displayLeaderboard() { 
    let leaderboard = getLeaderboard();
    let html = "<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
    leaderboard.forEach((entry, index) => {
        html += `<tr><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
    });
    html += "</table>";
    document.getElementById("leaderboard").innerHTML = html;
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
document.getElementById('lagre-poeng').addEventListener('click', saveScore);
document.addEventListener('keydown', function(event) {
  if (event.key === 'k' || event.key === 'K' || event.key === 'd' || event.key === 'D') {
    rollDice();
  }
});
document.addEventListener('keydown', function(event) {
  if (event.key === 'n' || event.key === 'N' || event.key === 'a' || event.key === 'A') {
    resetGame();
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


//så : renderDice()
renderDice();
displayLeaderboard(); /*Dette er dine PERSONLIGE BESTE*/