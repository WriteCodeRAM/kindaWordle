import './style.css';
import { createBoard, populateRows } from './createBoard';
import { gameRulesModal } from './modals';
import { endingModal } from './modals';
import { statsModal } from './modals';
const axios = require('axios');

createBoard();

if (localStorage.length === 0) {
  const myObj = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    winRate: 0,
  };

  let myObj_serialized = JSON.stringify(myObj);
  localStorage.setItem('myObj', myObj_serialized);
}

const pointers = (() => {
  const rows = document.querySelectorAll('.row');
  const title = document.querySelector('h1');
  const numberOfChances = 6;
  const chancesLeft = numberOfChances;
  const errorP = document.querySelector('.error');
  let activeRow = 0;
  let tileNumber = 0;
  // let visited = localStorage.getItem('test');

  let words = [
    'GRITS',
    'ZESTY',
    'DAMES',
    'ALERT',
    'LOVER',
    'GAMER',
    'ELUDE',
    'PAIRS',
    'TWINS',
    'MEDIC',
    'LOSER',
    'CHORE',
    'MAIZE',
    'HORSE',
    'LUCKY',
    'OASIS',
    'READY',
    'PAUSE',
    'CLASH',
    'ERROR',
    'SPILL',
    'FLAIR',
    'THANK',
    'DOING',
    'NURSE',
    'STONE',
    'MOWED',
    'TRIBE',
    'PANIC',
    'FOUND',
    'LUNAR',
    'DRIFT',
    'STEAM',
    'SHEEP',
    'WAIVE',
    'ACUTE',
    'INURE',
    'LEGAL',
    'BROAD',
    'PEDAL',
    'GLOAT',
  ];

  let wordle = words[Math.floor(Math.random() * words.length)];

  title.addEventListener('click', () => {
    location.reload();
  });

  return {
    activeRow,
    tileNumber,
    numberOfChances,
    chancesLeft,
    wordle,

    rows,
    errorP,
    words,
  };
})();

if (!localStorage.visited) {
  gameRulesModal();
}

localStorage.setItem('visited', '1');

populateRows(pointers.rows);

const keyboardListener = (e) => {
  if (pointers.numberOfChances == 0) {
    return;
  }

  let pressedKey = e.key;

  if (pressedKey == 'Backspace' && pointers.tileNumber !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey == 'Enter' && pointers.tileNumber === 5) {
    gradeGuess();
    //have condition to go to next row
    return;
  }

  // See if input needs to be added to board.
  let validKey = pressedKey.match(/[a-z]/gi);
  if (!validKey || validKey.length > 1) {
    return;
  } else if (pointers.tileNumber !== 5) {
    insertLetter(pressedKey);
  }
};

document.addEventListener('keyup', keyboardListener);

//add keyboard buttons input to game board
const keyboard = (() => {
  const keys = document.querySelectorAll('button');

  keys.forEach((key) => {
    key.addEventListener('click', (e) => {
      let letter = e.target.innerText;
      if (letter === 'DEL' && pointers.tileNumber !== 0) {
        deleteLetter();
      } else if (letter === 'ENTER' && pointers.tileNumber === 5) {
        gradeGuess();
      } else if (
        letter !== 'DEL' &&
        letter !== 'ENTER' &&
        pointers.tileNumber !== 5
      ) {
        insertLetter(letter);
      }
    });
  });
  return { keys };
})();

const insertLetter = (letter) => {
  pointers.rows[pointers.activeRow].children[pointers.tileNumber].innerText =
    letter;
  pointers.tileNumber++;
};

const deleteLetter = () => {
  pointers.rows[pointers.activeRow].children[
    pointers.tileNumber - 1
  ].innerText = '';
  pointers.tileNumber--;
};

//Compare user guess to wordle
const gradeGuess = () => {
  let guess = '';

  for (let i = 0; i < 5; i++) {
    guess += pointers.rows[pointers.activeRow].children[i].innerText;
  }

  //  ------------------------------------------------------------------------------------------------------------------ //
  //API VALID WORD CHECK

  const options = {
    method: 'GET',
    url: `https://wordsapiv1.p.rapidapi.com/words/${guess}/typeOf`,
    headers: {
      'X-RapidAPI-Key': 'dc93ee594cmsh3d384c14d13a9edp19dd7fjsn4cb68636655f',
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
    },
  };

  axios
    .request(options)
    .then(function () {
      //frequency counter / letter bank
      let letterBank = {};

      for (let i = 0; i < pointers.wordle.length; i++) {
        let char = pointers.wordle[i];
        letterBank[char] ? (letterBank[char] += 1) : (letterBank[char] = 1);
      }

      //compare the two strings (wordle vs guess)
      //grading color logic
      for (let i = 0; i < guess.length; i++) {
        //letter not in word
        if (!letterBank[guess[i]]) {
          colorGrade(i, '#bc4b51');
          //letter in word and in right index
        } else if (guess[i] === pointers.wordle[i]) {
          colorGrade(i, '#8cb369');
        } else {
          //   colorGrade(i, '#f4e285');
          colorGrade(i, '#ddc85d');
        }
      }

      pointers.errorP.innerText = '';

      pointers.chancesLeft--;
      if (guess === pointers.wordle || pointers.chancesLeft === 0) {
        endGame(guess);
      }

      pointers.activeRow++;
      pointers.tileNumber = 0;
    })
    .catch(function () {
      // console.log('that shit is not a word');
      pointers.errorP.innerText = 'Invalid word.';
    });

  //  ------------------------------------------------------------------------------------------------------------------ //
};

const colorGrade = (index, color) => {
  pointers.rows[pointers.activeRow].children[index].style.backgroundColor =
    color;
  document.getElementById(
    `${pointers.rows[pointers.activeRow].children[index].innerText}`
  ).style.backgroundColor = color;
};

//disable buttons & keyboard after win or loss
const endGame = (guess) => {
  //  ------------------------------------------local storage-------------------------------------------------- //
  // Retrieves the string and converts it to a JavaScript object
  const retrievedString = localStorage.getItem('myObj');
  const parsedObject = JSON.parse(retrievedString);

  parsedObject.gamesPlayed++;

  // Modifies the object, converts it to a string and replaces the existing `myObj` in LocalStorage

  if (pointers.wordle === guess) {
    parsedObject.gamesWon++;

    parsedObject.currentStreak++;
    if (parsedObject.maxStreak < parsedObject.currentStreak) {
      parsedObject.maxStreak = parsedObject.currentStreak;
    }
    endingModal(
      pointers.numberOfChances - pointers.chancesLeft,
      1,
      pointers.wordle
    );
  } else {
    parsedObject.currentStreak = 0;
    endingModal(
      pointers.numberOfChances - pointers.chancesLeft,
      0,
      pointers.wordle
    );
  }

  keyboard.keys.forEach((key) => {
    key.disabled = true;
  });

  parsedObject.maxStreak;
  document.removeEventListener('keyup', keyboardListener);
  pointers.visited = true;

  const stringifiedForStorage = JSON.stringify(parsedObject);

  localStorage.setItem('myObj', stringifiedForStorage);
};

document.getElementById('stats').addEventListener('click', statsModal);
document.getElementById('rules').addEventListener('click', gameRulesModal);
