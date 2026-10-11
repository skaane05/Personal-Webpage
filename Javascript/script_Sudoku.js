function generateSudoku() {
    console.log("Generating Sudoku puzzle...");
    let SIZE = document.getElementById("size").value;
    switch (SIZE) {
        case "nine": SIZE = 9; break; /*  the break is necessary in a JavaScript switch statement to prevent "fall-through" (executing the next case). */
        case "sixteen": SIZE = 16; break;
        case "twentyfive": SIZE = 25; break; /* Size 25 and 36 disable for now because they literally don't work with the current algorithm (didnt load for 40 mins!!!!) */
        case "thirtysix": SIZE = 36; break;
    }
    SIZE = Number(SIZE); /* Convert SIZE to a number (makes sure it is a number - see removeNumbers() ) */
    document.getElementById("sudoku-container").innerHTML = "<div style='text-align:center;font-size:1.5em;'>Loading...</div>"; /* Show loading message while generating the Sudoku puzzle */
    setTimeout(() => { // Use setTimeout to allow the browser to update the DOM before running the heavy computation
        const difficulty = document.getElementById("difficulty").value;
        const fullBoard = generateFullBoard(SIZE);
        console.log("Generating Sudoku puzzle with size:", SIZE, "and difficulty:", difficulty);
        const puzzle = removeNumbers(fullBoard, difficulty, SIZE);
        renderBoard(puzzle, SIZE);
    }, 100); // 100ms delay to allow DOM update
    // Note: The delay can be adjusted based on performance needs, or removed if not necessary.
    // This approach ensures that the loading message is displayed before the heavy computation starts.
}

// === 1. Lag en full Sudoku ===
function generateFullBoard(SIZE) {
    let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    solve(board, SIZE); // fyll hele brettet
    return board;
}

function solve(board, SIZE) { /* Denne lager løsningen til Sudokuen, da tall blir senere lagt til */
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffle([...Array(SIZE).keys()].map(n => n + 1));
        for (let num of numbers) {
            if (isValid(board, row, col, num, SIZE)) {
                board[row][col] = num;
                if (solve(board, SIZE)) return true;
                board[row][col] = 0;
            }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board, row, col, num, SIZE) { /* Sjekker om hver rad og kolonne summerer til SIZE */
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
    const boxRow = Math.floor(row / Math.sqrt(SIZE)) * Math.sqrt(SIZE) + Math.floor(i / Math.sqrt(SIZE));
    const boxCol = Math.floor(col / Math.sqrt(SIZE)) * Math.sqrt(SIZE) + i % Math.sqrt(SIZE);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function shuffle(array) { /* Blir allerede kalt på med SIZE i solve, denne bare generer tilfeldige tall */
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// === 2. Fjern tall basert på vanskelighetsgrad ===
function removeNumbers(board, difficulty, SIZE) {
    console.log("removeNumbers called with difficulty:", difficulty);
    let baseAttempts = { easy: 0.4, medium: 0.55, hard: 0.7, expert: 0.85, impossible: 0.95 }[difficulty]; /*  value between 0 and 1 that represents the percentage of cells to remove from the Sudoku board, based on the selected difficulty. */
    if (typeof baseAttempts !== 'number' || isNaN(baseAttempts)) {
        baseAttempts = 0.4; // fallback to easy if not found
        console.warn("Invalid difficulty level, defaulting to easy.");
    }
    let attempts = Math.floor(SIZE * SIZE * baseAttempts); /* attempts is the actual number of cells to remove. */
    console.log("Calculated attempts based on difficulty:", attempts);
    if (attempts > SIZE * SIZE) {
        attempts = SIZE ; // Ensure we don't try to remove more cells than exist, SIZE * SIZE is the total number of cells in the Sudoku board. Therefore we cannot remove more cells than there are.
        console.warn("Attempts exceeds total cells, adjusting to maximum possible:", attempts);
    }
    const newBoard = board.map(row => [...row]);

    console.log("Antall celler:", SIZE * SIZE);
    console.log("baseAttempts:", baseAttempts);
    console.log("attempts after check:", attempts);

    // Create a list of all cell positions
    let positions = [];
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            positions.push([row, col]);
        }
    }
    // Shuffle the positions
    positions = shuffle(positions);
    // Remove numbers from the first N positions
    for (let i = 0; i < attempts; i++) {
        if (!positions[i]) {
            console.warn("Tried to remove more cells than available positions. Breaking early.");
            break;
        }
        const [row, col] = positions[i];
        if (typeof row !== 'number' || typeof col !== 'number' || !newBoard[row]) {
            console.error("Invalid row/col or newBoard[row] is undefined", {row, col, newBoardRow: newBoard[row], i, SIZE, positions});
            break;
        }
        newBoard[row][col] = 0;
    }
    console.log("Numbers removed:", attempts);
    return newBoard;
}

// === 3. Tegn brettet i HTML ===
function renderBoard(board, SIZE) {
    const container = document.getElementById("sudoku-container");
    container.innerHTML = "";
    const boxSize = Math.sqrt(SIZE);
    console.log("Rendering Sudoku board with size:", SIZE);

    // Create a table for better grid control
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";

    for (let row = 0; row < SIZE; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < SIZE; col++) {
            const td = document.createElement("td");
            td.style.padding = "0";
            td.style.margin = "0";

            // Set borders for box grid
            td.style.border = "1px solid #ccc";
            if (row % boxSize === 0) td.style.borderTop = "2px solid black";
            if (col % boxSize === 0) td.style.borderLeft = "2px solid black";
            if (row === SIZE - 1) td.style.borderBottom = "2px solid black";
            if (col === SIZE - 1) td.style.borderRight = "2px solid black";

            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 2;
            input.style.width = "2em";
            input.style.height = "2em";
            input.style.textAlign = "center";
            input.style.fontSize = "1em";
            input.style.border = "none";
            input.style.background = board[row][col] !== 0 ? "#eee" : "#fff"; // board[row][col] = celle
            if (board[row][col] !== 0) {
                input.value = board[row][col];
                input.disabled = true;
            }

            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
}

/* When completed, a function who checks if the Sudoku puzzle is full */
function isFilled(board, SIZE) {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === 0) return false;
        }
    }
    console.log("Sudoku puzzle is filled.");
    return true;
}
/* When completed, a function who checks if content is a acceptable solution */
function isValidSolution(board, SIZE) {
    if (!isFilled(board, SIZE)) return false;
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const num = board[row][col];
            if (num !== 0 && !isValid(board, row, col, num, SIZE)) {
                return false;
            }
        }
    }
    console.log("Sudoku solution is valid.");
    return true;
}
