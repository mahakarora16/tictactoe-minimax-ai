const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
let currentPlayer = "X"; // You
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleClick));

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  makeMove(index, "X");

  if (checkGameOver("X")) return;

  statusText.textContent = "Computer Thinking...";
  setTimeout(() => {
    const bestMove = minimax(board, "O").index;
    makeMove(bestMove, "O");
    checkGameOver("O");
  }, 300);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
}

function checkWinner(player) {
  return winningCombos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

function checkGameOver(player) {
  if (checkWinner(player)) {
    statusText.textContent = player === "X" ? "You Win!" : "Computer Wins!";
    gameActive = false;
    return true;
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return true;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (currentPlayer === "X") statusText.textContent = "Your Turn";
  return false;
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => (cell.textContent = ""));
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Your Turn";
}

// Minimax algorithm
function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((val, idx) => (val === "" ? idx : null))
    .filter(val => val !== null);

  if (checkWinner("X")) return { score: -10 };
  if (checkWinner("O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  let moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    let result = minimax(newBoard, player === "O" ? "X" : "O");
    move.score = result.score;

    newBoard[availSpots[i]] = ""; // Undo move
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
