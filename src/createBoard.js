const createBoard = () => {
  const gameboard = document.querySelector('.game-board');
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('div');
    row.setAttribute('row', i);
    row.classList.add('row');
    gameboard.appendChild(row);
  }
};

const populateRows = (rows) => {
  rows.forEach((row) => {
    for (let i = 0; i < 5; i++) {
      const tile = document.createElement('div');
      tile.setAttribute('index', i);
      tile.classList.add('tile');
      //   tile.innerText = 'R';

      tile.addEventListener('keyup', (e) => {
        tile.innerText = e.target.innerText;
      });
      //   tile.classList.add('row');

      row.appendChild(tile);
    }
  });
};

export { createBoard, populateRows };
