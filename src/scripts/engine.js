/** @format */
const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fielCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    playerBox: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImagem = "/src/assets/icons/";
const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImagem}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImagem}Magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImagem}Exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function removeAllCardsImages() {
  let { computerBox, playerBox } = state.playerSides;
  let imgElements = computerBox.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = playerBox.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function getRandomCardId() {
  const radomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[radomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "/src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardsfield(cardImage.getAttribute("data-id"));
    });
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(idCard);
    });
  }

  return cardImage;
}
async function setCardsfield(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fielCards.player.style.display = "block";
  state.fielCards.computer.style.display = "block";

  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";

  state.fielCards.player.src = cardData[cardId].img;
  state.fielCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function updateScore() {
  state.score.scoreBox.innerHTML = `win: ${state.score.playerScore} | lose: ${state.score.computerScore}`;
}

async function drawButton(duelResults) {
  state.actions.button.innerText = "Reiniciar Jogo";
  state.actions.button.style.display = "block";

  state.actions.button.onclick = () => {
    resetDuel();
  };
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "draw";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "win";
    state.score.playerScore++;
  }
  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "lose";
    state.score.computerScore++;
  }
  await playAudio(duelResults);

  return duelResults;
}

async function resetDuel() {
  state.fielCards.player.style.display = "none";
  state.fielCards.computer.style.display = "none";

  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";

  state.actions.button.style.display = "none";

  await removeAllCardsImages();

  init();
}

async function playAudio(status) {
  try {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    await audio.play();
  } catch (error) {
    console.error("Erro ao reproduzir áudio:", error);
  }
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "attibute : " + cardData[index].type;
}
async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
  0;
}

const init = () => {
  state.fielCards.player.style.display = "none";
  state.fielCards.computer.style.display = "none";

  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
};

init();
