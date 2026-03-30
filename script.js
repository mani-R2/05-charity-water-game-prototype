// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');
console.log(document.getElementById("timer"));

const types = [
  { type: "person", icon: "👤" },
  { type: "clean", icon: "💧" },
  { type: "dirty", icon: "🦠" }
];

const maxScore = 4;

let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;
let score = 0;

let difficulty = "easy";
let timeLeft = 30;
let timerInterval;
let gameStarted = false;

const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const progressBar = document.getElementById("progress");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
const resetBtn = document.getElementById("resetBtn");

const modal = document.getElementById("endModal");
const endTitle = document.getElementById("endTitle");
const endMessage = document.getElementById("endMessage");

document.getElementById("timer").style.color = "red";
resetBtn.addEventListener("click", startGame);

function startGame() {
  modal.classList.add("hidden");

  grid.innerHTML = "";
  score = 0;
  updateScore();
  message.textContent = "Match people with clean water 💧";

  console.log("Game started, timer should run");
  console.log("Timer started");

  cards = [];

  for (let i = 0; i < 4; i++) {
    types.forEach(t => cards.push({ ...t }));
  }
  shuffle(cards);

  cards.forEach((cardData) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.type = cardData.type;
    card.dataset.icon = cardData.icon;
    card.textContent = "?";

    card.addEventListener("click", handleClick);
    grid.appendChild(card);
  });

  if (difficulty === "easy") timeLeft = 30;
  if (difficulty === "normal") timeLeft = 20;
  if (difficulty === "hard") timeLeft = 12;

  gameStarted = false;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function handleClick(e) {
  if (lock) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  const card = e.target;

  if (card === firstCard || card.classList.contains("matched")) return;

  card.textContent = card.dataset.icon;

  // Add color feedback instantly
  if (card.dataset.type === "clean") card.classList.add("clean");
  if (card.dataset.type === "dirty") card.classList.add("dirty");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lock = true;

  checkMatch();
}

function checkMatch() {
  const type1 = firstCard.dataset.type;
  const type2 = secondCard.dataset.type;

  if (
    (type1 === "person" && type2 === "clean") ||
    (type1 === "clean" && type2 === "person")
  ) {
    // ✅ Correct match
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    score++;
    updateScore();

    message.textContent = "+1 person now has clean water 💧";

    if (score === 4) {
      clearInterval(timerInterval);
      endGame(true);
    }

    resetTurn();
  } else {
    // ❌ Wrong match
    message.textContent = "Dirty water harms communities 🦠";

    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";

      firstCard.classList.remove("clean", "dirty");
      secondCard.classList.remove("clean", "dirty");

      resetTurn();
    }, 800);
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
  let progressPercent = (score / maxScore) * 100;
  progressPercent = Math.min(progressPercent, 100);
  progressBar.style.width = progressPercent + "%";
}

function setDifficulty(level) {
  difficulty = level;

  if (level === "easy") timeLeft = 30;
  if (level === "normal") timeLeft = 20;
  if (level === "hard") timeLeft = 12;

  startGame();
}

function startTimer() {
  clearInterval(timerInterval);

  const timerEl = document.getElementById("timer");

  if (!timerEl) {
    console.error("❌ Timer element NOT found");
    return;
  }

  timerEl.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

function endGame(win) {
  lock = true;
  clearInterval(timerInterval);

  modal.classList.remove("hidden");

  if (win) {
    endTitle.textContent = "🎉 You Win!";
    endMessage.textContent = `You helped everyone with ${timeLeft}s left! 💧`;
  } else {
    endTitle.textContent = "⏳ Time’s Up!";
    endMessage.textContent = "Not everyone got clean water. Try again!";
  }
}

console.log("Game started, timer should run");




function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

startGame();

