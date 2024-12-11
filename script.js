const grid = document.getElementById('grid');
const gameStatus = document.getElementById('gameStatus');
const resetButton = document.getElementById('reset');
const toggleModeButton = document.getElementById('toggleMode');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');
const draws = document.getElementById('draws');
const highScoreX = document.getElementById('highScoreX');
const highScoreO = document.getElementById('highScoreO');
const highScoreDraws = document.getElementById('highScoreDraws');

let currentPlayer = 'X';
let gameMode = 'two-player';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function initializeGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive || (gameMode === 'single-player' && currentPlayer === 'O')) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    if (checkWinner()) {
        gameStatus.textContent = `Player ${currentPlayer} Wins!`;
        gameStatus.className = 'winner';
        updateScores(currentPlayer);
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        gameStatus.textContent = 'It\'s a Draw!';
        gameStatus.className = 'draw';
        updateScores('draw');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s Turn`;

    if (gameMode === 'single-player' && currentPlayer === 'O') {
        aiMove();
    }
}

function checkWinner() {
    for (let combination of winningConditions) {
        if (combination.every(index => board[index] === currentPlayer)) {
            highlightWinningCells(combination); 
            return true;
        }
    }
    return false;
}

function highlightWinningCells(combination) {
    combination.forEach(index => {
        const cell = document.querySelector(`[data-index='${index}']`);
        cell.classList.add('winning');
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameStatus.textContent = "Player X's Turn";
    gameStatus.className = '';
    initializeGrid();

   
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('winning'));
}

function toggleGameMode() {
    gameMode = gameMode === 'two-player' ? 'single-player' : 'two-player';
    toggleModeButton.textContent = gameMode === 'two-player' ? 'Switch to Single Player Mode' : 'Switch to Two Player Mode';
    resetGame();
}

function updateScores(winner) {
    const scores = JSON.parse(localStorage.getItem('scores')) || { X: 0, O: 0, draw: 0 };
    const highScores = JSON.parse(localStorage.getItem('highScores')) || { X: 0, O: 0, draw: 0 };

    if (winner === 'X') {
        scores.X += 1;
        if (scores.X > highScores.X) {
            highScores.X = scores.X;
        }
    } else if (winner === 'O') {
        scores.O += 1;
        if (scores.O > highScores.O) {
            highScores.O = scores.O;
        }
    } else if (winner === 'draw') {
        scores.draw += 1;
        if (scores.draw > highScores.draw) {
            highScores.draw = scores.draw;
        }
    }

    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('highScores', JSON.stringify(highScores));

    playerXScore.textContent = scores.X;
    playerOScore.textContent = scores.O;
    draws.textContent = scores.draw;

    highScoreX.textContent = highScores.X;
    highScoreO.textContent = highScores.O;
    highScoreDraws.textContent = highScores.draw;
}

function loadScores() {
    const scores = JSON.parse(localStorage.getItem('scores')) || { X: 0, O: 0, draw: 0 };
    const highScores = JSON.parse(localStorage.getItem('highScores')) || { X: 0, O: 0, draw: 0 };

    playerXScore.textContent = scores.X;
    playerOScore.textContent = scores.O;
    draws.textContent = scores.draw;

    highScoreX.textContent = highScores.X;
    highScoreO.textContent = highScores.O;
    highScoreDraws.textContent = highScores.draw;
}

function aiMove() {
    if (!gameActive) return;

    const emptyCells = board.map((value, index) => (value === '' ? index : null)).filter(index => index !== null);
    const move = emptyCells[0];

    if (move !== undefined) {
        const aiCell = document.querySelector(`[data-index='${move}']`);
        board[move] = 'O';
        aiCell.textContent = 'O';
        aiCell.classList.add('taken');

        if (checkWinner()) {
            gameStatus.textContent = `Player O Wins!`;
            gameStatus.className = 'winner';
            updateScores('O');
            gameActive = false;
            return;
        }

        if (board.every(cell => cell !== '')) {
            gameStatus.textContent = 'It\'s a Draw!';
            gameStatus.className = 'draw';
            updateScores('draw');
            gameActive = false;
            return;
        }

        currentPlayer = 'X';
        gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

resetButton.addEventListener('click', resetGame);
toggleModeButton.addEventListener('click', toggleGameMode);

loadScores();
initializeGrid();
