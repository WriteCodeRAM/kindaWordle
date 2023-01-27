//create modal for game ending notification

const domElements = (() => {
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.close-modal');
  const modalh2 = document.querySelector('.modal-h2');
  const modalh3 = document.querySelector('.modal-h3');
  const gamesPlayed = document.querySelector('.gamesPlayed');
  const gamesWon = document.querySelector('.gamesWon');
  const currentStreak = document.querySelector('.currentStreak');
  const maxStreak = document.querySelector('.maxStreak');
  const winRate = document.querySelector('.winRate');
  const playAgainBtn = document.createElement('button');

  playAgainBtn.innerText = 'Play Again?';

  playAgainBtn.addEventListener('click', () => {
    location.reload();
  });

  return {
    modal,
    overlay,
    btnCloseModal,
    modalh2,
    modalh3,
    gamesPlayed,
    gamesWon,
    currentStreak,
    maxStreak,
    winRate,
    playAgainBtn,
  };
})();

const closeModal = () => {
  domElements.modal.classList.add('hidden');
  domElements.overlay.classList.add('hidden');
};

const gameRulesModal = () => {
  domElements.modal.classList.remove('hidden');
  domElements.overlay.classList.remove('hidden');

  domElements.modal.innerHTML = ``;

  domElements.modal.innerHTML = ` <div class="modal ">
    <div class="close-modal">&times;</div>
    <div class="modal-content">
    <h2 class="modal-h2">Rules</h2>
    <h3 class="modal-h3">Guess the wordle in 6 tries.</h3>
    <div class="stats">
        <h4>Stats</h4>
        <div class="gamesPlayed"></div>
        <div class="gamesWon"></div>
        <div class="currentStreak"></div>
        <div class="maxStreak"></div>
        <div class="winRate"></div>
    </div>
    <ul class='customIndent'>
        <li>Each guess must be a valid 5 letter word.</li>
        <li>The color of the tiles will change to show how close your guess was to the word.</li>
    </ul>
    <p><span class="green">GREEN</span> signifies a letter in the <span class="green">CORRECT</span> spot of the wordle.</p>
    <p><span class="yellow">YELLOW</span> signifies a letter in the <span class="yellow">INCORRECT</span> spot of the wordle.</p>
    <p><span class="red">RED</span> signifies a letter that is <span class="red">NOT</span> in the wordle.</p>
</div>
  </div>
  <div class="overlay "></div>`;

  domElements.overlay.addEventListener('click', closeModal);
  domElements.modal.addEventListener('click', closeModal);

  domElements.btnCloseModal.addEventListener('click', closeModal);
  domElements.overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (evt) {
    // console.log(evt.key);

    if (evt.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};

const endingModal = (chances, won, wordle) => {
  //   console.log(`accessing local from modal.js`);
  //   console.log(localStorage);
  domElements.modal.innerText = '';
  domElements.modal.classList.remove('hidden');
  domElements.overlay.classList.remove('hidden');
  if (won) {
    domElements.modalh2.innerText = 'You got it!';
    chances > 1
      ? (domElements.modalh3.innerText = `It took you ${chances} tries to guess the wordle!`)
      : (domElements.modalh3.innerText = `It took you ${chances} try to guess the wordle!`);
  } else {
    domElements.modalh2.innerText = `Sorry, you failed to guess the wordle: ${wordle}`;
    domElements.modalh3.innerText = `Better luck next time!`;
  }
  domElements.modal.appendChild(domElements.modalh2);
  domElements.modal.appendChild(domElements.modalh3);
  domElements.overlay.addEventListener('click', closeModal);
  domElements.modal.addEventListener('click', closeModal);
  domElements.modal.appendChild(domElements.playAgainBtn);
};

const statsModal = () => {
  domElements.modal.innerText = '';
  domElements.modal.classList.remove('hidden');
  domElements.overlay.classList.remove('hidden');

  domElements.overlay.addEventListener('click', closeModal);
  domElements.modal.addEventListener('click', closeModal);

  domElements.gamesPlayed.innerText = `Games Played: ${
    JSON.parse(localStorage.getItem('myObj')).gamesPlayed
  } `;

  domElements.gamesWon.innerText = `Games Won: ${
    JSON.parse(localStorage.getItem('myObj')).gamesWon
  } `;

  domElements.currentStreak.innerText = `Current Streak: ${
    JSON.parse(localStorage.getItem('myObj')).currentStreak
  } `;

  domElements.maxStreak.innerText = `Longest Streak: ${
    JSON.parse(localStorage.getItem('myObj')).maxStreak
  } `;

  domElements.winRate.innerText = `Win Rate: ${(
    (JSON.parse(localStorage.getItem('myObj')).gamesWon /
      JSON.parse(localStorage.getItem('myObj')).gamesPlayed) *
    100
  ).toFixed()}%`;

  //   console.log(JSON.parse(localStorage.getItem('myObj')).gamesPlayed);
  domElements.modal.appendChild(domElements.gamesPlayed);
  domElements.modal.appendChild(domElements.gamesWon);
  domElements.modal.appendChild(domElements.currentStreak);
  domElements.modal.appendChild(domElements.maxStreak);
  domElements.modal.appendChild(domElements.winRate);
};

export { gameRulesModal, endingModal, statsModal };
