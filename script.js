// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

const types = [
  { type: "person", icon: "👤" },
  { type: "clean", icon: "💧" },
  { type: "dirty", icon: "🦠" }
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;
let score = 0;

const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const progressBar = document.getElementById("progress");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", startGame);

function startGame() {
  grid.innerHTML = "";
  score = 0;
  updateScore();
  message.textContent = "Match people with clean water 💧";

  cards = [];

  // Create 4 of each type
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
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function handleClick(e) {
  if (lock) return;

  const card = e.target;

  if (card === firstCard || card.classList.contains("matched")) return;

  card.textContent = card.dataset.icon;

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
    // Correct match
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    score++;
    updateScore();

    message.textContent = "+1 person now has clean water 💧";

    resetTurn();
  } else {
    // Wrong match
    message.textContent = "Dirty water harms communities 🦠";

    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      resetTurn();
    }, 800);
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
  progressBar.style.width = (score * 20) + "%";
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

// Start game on load
startGame();
