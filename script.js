const TOTAL_CELLS = 100;
const moderatorGrid = document.getElementById("moderatorGrid");
const playerGrid = document.getElementById("playerGrid");
const scoreTable = document.querySelector("#scoreTable tbody");
const resultSection = document.getElementById("resultSection");

let colors = [];
let correctIndex = null;
let clue = "";
let scores = {};
let guessedCells = {};

function hslToHex(h, s = 100, l = 50) {
  l /= 100; s /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}`;
}

function generateColors() {
  const step = 360 / TOTAL_CELLS;
  colors = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    colors.push(hslToHex(i * step));
  }
}

function renderGrid(target, onClick) {
  target.innerHTML = "";
  colors.forEach((color, index) => {
    const div = document.createElement("div");
    div.className = "colorCell";
    div.style.backgroundColor = color;
    div.dataset.index = index;
    div.addEventListener("click", () => onClick(index, div));
    target.appendChild(div);
  });
}

function setClueAndAnswer(index) {
  correctIndex = index;
  clue = prompt("Enter your one-word clue:");
  if (!clue) return alert("You must enter a clue!");

  document.getElementById("clueDisplay").textContent = `Clue: ${clue}`;
  document.getElementById("moderatorView").style.display = "none";
  document.getElementById("playerView").style.display = "block";
  document.getElementById("toPlayerBtn").style.display = "inline-block";
}

function backToPlayerView() {
  document.getElementById("moderatorView").style.display = "none";
  document.getElementById("playerView").style.display = "block";
}

function handlePlayerGuess(index, cell) {
  const playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Enter your name first!");
  if (!guessedCells[playerName]) guessedCells[playerName] = new Set();
  if (guessedCells[playerName].has(index)) return;

  guessedCells[playerName].add(index);

  const label = document.createElement("div");
  label.className = "guessLabel";
  label.textContent = playerName;
  cell.appendChild(label);

  if (index === correctIndex) {
    cell.classList.add("correct");
    scores[playerName] = (scores[playerName] || 0) + 1;
    updateScores();
  } else {
    cell.classList.add("wrong");
  }
}

function updateScores() {
  scoreTable.innerHTML = "";
  Object.entries(scores).forEach(([name, score]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${name}</td><td>${score}</td>`;
    scoreTable.appendChild(row);
  });
}

function revealAnswer() {
  const cells = playerGrid.querySelectorAll(".colorCell");
  const target = cells[correctIndex];
  target.classList.add("correct");
  const label = document.createElement("div");
  label.className = "guessLabel";
  label.textContent = "🎯 Correct Answer";
  target.appendChild(label);

  resultSection.innerHTML = `<p><strong>Answer:</strong> ${colors[correctIndex]}</p>`;
}

function resetGame() {
  correctIndex = null;
  clue = "";
  guessedCells = {};
  resultSection.innerHTML = "";
  document.getElementById("playerName").value = "";
  document.getElementById("clueDisplay").textContent = "";
  document.getElementById("moderatorView").style.display = "block";
  document.getElementById("playerView").style.display = "none";
  document.getElementById("toPlayerBtn").style.display = "none";
  renderGrid(moderatorGrid, setClueAndAnswer);
  renderGrid(playerGrid, handlePlayerGuess);
}

function fullResetGame() {
  correctIndex = null;
  clue = "";
  scores = {};
  guessedCells = {};
  resultSection.innerHTML = "";
  scoreTable.innerHTML = "";
  document.getElementById("clueDisplay").textContent = "";
  document.getElementById("playerName").value = "";
  document.getElementById("moderatorView").style.display = "block";
  document.getElementById("playerView").style.display = "none";
  document.getElementById("toPlayerBtn").style.display = "none";
  generateColors();
  renderGrid(moderatorGrid, setClueAndAnswer);
  renderGrid(playerGrid, handlePlayerGuess);
}

generateColors();
renderGrid(moderatorGrid, setClueAndAnswer);
renderGrid(playerGrid, handlePlayerGuess);
