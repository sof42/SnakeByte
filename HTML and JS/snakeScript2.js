// variables
const rows = 10;
const columns = 10;
let snake = [{ x: 0, y: 0 }];
let apple = null;
let obstacles = [];

const PlayField = document.createElement('div');
PlayField.id = 'PlayField';
const table = document.createElement('table');
table.id = 'PlayGame';


for (var i = 0; i<rows; i++){
  const row = document.createElement('tr');
  for(var j = 0; j<columns; j++){
    const cell = document.createElement('td');
    cell.className = 'cells';
    cell.id = `${i} ${j}`;
    row.appendChild(cell);
  }
  table.appendChild(row);
}
PlayField.appendChild(table);
let score = 0;
const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'ScoreDisplay';
scoreDisplay.innerText = `Score: ${score}`;
document.body.appendChild(scoreDisplay);
document.body.appendChild(PlayField);
generateApple();
generateObstacles();
// generate initial snake
for (let i = 0; i < snake.length; i++) {
  const cell = document.getElementById(`${snake[i].x} ${snake[i].y}`);
  cell.style.backgroundImage = 'linear-gradient(to right, #009900, #00b300)';
}

let gameInterval = setInterval(() => {
  moveSnake();
}, 200);

document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
    changeDirection(key);
  }
});

function changeDirection(direction) {
  // Do not allow 180 degree turns
  const currentDirection = getCurrentDirection();
  if (
    (direction === 'ArrowUp' && currentDirection === 'ArrowDown') ||
    (direction === 'ArrowDown' && currentDirection === 'ArrowUp') ||
    (direction === 'ArrowLeft' && currentDirection === 'ArrowRight') ||
    (direction === 'ArrowRight' && currentDirection === 'ArrowLeft')
  ) {
    return;
  }

  snake[0].direction = direction;
}

function getCurrentDirection() {
  const head = snake[0];
  return head.direction;
}

function moveSnake() {
  const head = snake[0];
  let x = head.x;
  let y = head.y;

  switch (getCurrentDirection()) {
    case 'ArrowUp':
      x--;
      break;
    case 'ArrowDown':
      x++;
      break;
    case 'ArrowLeft':
      y--;
      break;
    case 'ArrowRight':
      y++;
      break;
  }

  if (isCollision(x, y) || isObstacleCollision(x, y)) {
  //game over logic 
    clearInterval(gameInterval);
    alert(`Game over! Your score was ${score}. Try again.`);
    resetPlayField();
    gameInterval = setInterval(() => {
      moveSnake();
    }, 200);
    return;
  }
  //The unshift method adds the specified elements to the beginning of an array and returns the new length of the array.
  snake.unshift({ x: x, y: y });
  const newHeadCell = document.getElementById(`${x} ${y}`);
  newHeadCell.style.backgroundImage = 'linear-gradient(to right, #009900, #00b300)';

  if (x === apple.x && y === apple.y) {
    score++;
    scoreDisplay.innerText = `Score: ${score}`;
    generateApple();
  } else {
    // If snake doesn't eat apple, remove the tail
    const oldTail = snake.pop();
    const oldTailCell = document.getElementById(`${oldTail.x} ${oldTail.y}`);
    oldTailCell.removeAttribute('style');
  }
}
function isObstacleCollision(x, y) {
for (let i = 0; i < obstacles.length; i++) {
if (obstacles[i].x === x && obstacles[i].y === y) {
    return true;
  }
}
    return false;
}

function isCollision(x, y) {
  if (x < 0 || x >= rows || y < 0 || y >= columns) {
    // Out of bounds
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      // Collision with self
      return true;
    }
  }

  return false;
}

function generateApple() {
  let x = Math.floor(Math.random() * columns);
  let y = Math.floor(Math.random() * rows);

  let isOnSnake = false;
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      isOnSnake = true;
      break;
    }
  }
  let isOnObstacle = false;
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x === x && obstacles[i].y === y) {
      isOnObstacle = true;
      break;
    }
  }

  if (isOnSnake || isOnObstacle) {
    // try again if apple is on snake or obstacle
    generateApple();
    return;
  }

  if (apple) {
    // remove old apple
    const oldAppleCell = document.getElementById(`${apple.x} ${apple.y}`);
    oldAppleCell.classList.remove('apple');
    oldAppleCell.innerHTML = '';
  }

  const cell = document.getElementById(`${x} ${y}`);
  cell.classList.add('apple');
  apple = { x: x, y: y };
  const food = document.createElement('img');
  food.src = '../Images/apple.png';
  cell.appendChild(food);
}
// genereate obstacles does not work for now
function generateObstacles() {
  // 5 obstacles to be generated
  for (let i = 0; i < 5; i++) {
    let x = Math.floor(Math.random() * columns);
    let y = Math.floor(Math.random() * rows);

    let isOnSnake = false;
    for (let j = 0; j < snake.length; j++) {
      if (snake[j].x === x && snake[j].y === y) {
        isOnSnake = true;
        break;
      }
    }

    let isOnApple = false;
    if (apple && apple.x === x && apple.y === y) {
      isOnApple = true;
    }

    let isOnObstacle = false;
    for (let j = 0; j < obstacles.length; j++) {
      //x+1 and y+1 just so the obstacles don't spawn right in front of or below snake
      if (obstacles[j].x === x && obstacles[j].y === y || (obstacles[j].x===0 && obstacles[j].y===1) || (obstacles[j].x===1 && obstacles[j].y===0)) {
        isOnObstacle = true;
        break;
      }
    }

    if (isOnSnake || isOnApple || isOnObstacle) {
      // try again if obstacle is on snake, apple or other obstacle
      i=i-1;
      continue;
    }

    const cell = document.getElementById(`${x} ${y}`);
    cell.classList.add('obstacle');
    obstacles.push({ x: x, y: y });
    const obstacle = document.createElement('img');
    obstacle.src = '../Images/stone.png';
    cell.appendChild(obstacle);
  }
}
function resetPlayField() {
  // Reset snake to initial position
  snake = [{ x: 0, y: 0 }];
  const snakeCell = document.getElementById(`${snake[0].x} ${snake[0].y}`);
  snakeCell.style.backgroundImage = 'linear-gradient(to right, #009900, #00b300)';

  // Remove apple and obstacles from the playfield
  if (apple) {
    const oldAppleCell = document.getElementById(`${apple.x} ${apple.y}`);
    oldAppleCell.classList.remove('apple');
    oldAppleCell.innerHTML = '';
    apple = null;
  }

  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    const obstacleCell = document.getElementById(`${obstacle.x} ${obstacle.y}`);
    obstacleCell.classList.remove('obstacle');
    obstacleCell.innerHTML = '';
  }
  obstacles = [];

  // Remove snake and obstacle styles from all cells
  const cells = document.getElementsByClassName('cells');
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeAttribute('style');
  }

  // Reset score display
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;

  // Generate new apple and obstacles
  generateApple();
  generateObstacles();
}
