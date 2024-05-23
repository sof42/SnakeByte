// variables
const rows = 10;
const columns = 10;
/* snake is an array of dicitonaries of x and y values, 
firstly initialized as the first cell of the table */
var snake = [{ x: 0, y: 0 }];
var apple = null;
var obstacles = [];
// last pressed direction gets changed when a key is pressed caught by the event listener
// and in autoMoveSnake function the snake is being moved in the last pressed direction
var lastPressedDirection = null;
var interval = null;
// the div in the hmtl that is displayed when a new High Score is reached
var loss = document.getElementById('loss');
// the div in the hmtl that is displayed when a new High Score is reached
var highS = document.getElementById('newHighScore');
// gamePaused is set to true whenever one of the two divs above is displayed, to stop
// the player movement
var gamePaused = false;

// creating a new div, whose id is PLayField
const PlayField = document.createElement('div');
PlayField.id = 'PlayField';
// creating a new table whose id is PlayGame
const table = document.createElement('table');
table.id = 'PlayGame';

// iterate rows
for (var i = 0; i<rows; i++){
  // create the rows
  const row = document.createElement('tr');
  // iterate columns
  for(var j = 0; j<columns; j++){
    // create new cells
    const cell = document.createElement('td');
    // with a class name 'cells' and an id of their position
    cell.className = 'cells';
    cell.id = `${i} ${j}`;
    // append the cells to the row
    row.appendChild(cell);
  }
  // append the rows to the table
  table.appendChild(row);
}
// append the table to the PlayField div
PlayField.appendChild(table);
// initially, set the current and high score to 0
var currentScore = 0;
var highScore = 0;
// creating divs for them
const highScoreDisplay = document.createElement('div');
const currentScoreDisplay = document.createElement('div');
// giving them both id's
currentScoreDisplay.id = 'currentScoreDisplay';
highScoreDisplay.id = 'highScoreDisplay';
// change the innerHTML to display the scores
currentScoreDisplay.innerHTML = `Current Score: ${currentScore}`;
highScoreDisplay.innerHTML = `High Score: ${highScore}`;
// append these divs to the body of the document
document.body.appendChild(currentScoreDisplay);
document.body.appendChild(highScoreDisplay);
// append the PlayField to the document
document.body.appendChild(PlayField);
// generate an apple on a random spot
generateApple();
// generate the obstacles
generateObstacles();

// generate the initial body of the snake
generateInitialSnake();

// start auto-moving snake with setInterval
interval = setInterval(autoMoveSnake, 200);

// attach an event listener to the document for the keydown event
document.addEventListener('keydown', (event) => {
  const key = event.key;
  // check if the pressed key is one of the arrow keys
  if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
    //Set the value of the lastPressedDirection to the pressed key; to be used in autoMoveSnake
    lastPressedDirection = key;
  }
});

// FUNCTIONS
// generate initial snake
function generateInitialSnake() {
  for (var i = 0; i < snake.length; i++) {
    const cell = document.getElementById(`${snake[i].x} ${snake[i].y}`);
      cell.style.backgroundColor = "rgba(32, 155, 33, 1)";
  }
}

function generateApple() {
  // get random positions for the apple
  let x = Math.floor(Math.random() * columns);
  let y = Math.floor(Math.random() * rows);

  // check if the apple is on a corner cell
  if ((x === 0 && y === 0) || (x === 0 && y === rows - 1) || (x === columns - 1 && y === 0) || (x === columns - 1 && y === rows - 1)) {
    // Generate a new apple if it's in the corner
    generateApple();
     // exit the current function execution
    return;
  }
  // check if the apple spawns on the snake, if so, it need to spawn elsewhere
  let isOnSnake = false;
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
       // exit the loop since we already found a match
      isOnSnake = true;
      break;
    }
  }
  // also check if the apple spawns on an obstacle, because it needs to spawn elsewhere
  let isOnObstacle = false;
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x === x && obstacles[i].y === y) {
       // exit the loop
      isOnObstacle = true;
      break;
    }
  }
  // if any of these contitions are fulfilled, generate a new apple
  if (isOnSnake || isOnObstacle) {
    // try again if apple is on snake or obstacle
    generateApple();
    return;
  }
  if (apple) {
    // check if there is an existing apple
    // remove old apple
    const oldAppleCell = document.getElementById(`${apple.x} ${apple.y}`);
    // remove the 'apple' class from the old apple cell and clear its content
    oldAppleCell.classList.remove('apple');
    oldAppleCell.innerHTML = '';
  }
  // update and display the new apple
  const cell = document.getElementById(`${x} ${y}`);
  cell.className = 'apple';
  // update the apple object with the new coordinates
  apple = { x: x, y: y };
  const food = document.createElement('img');
  food.src = '../Images/apple.png';
  cell.appendChild(food);
}

// genereate obstacles randomly
function generateObstacles() {
  // 5 obstacles to be generated
  for (let i = 0; i < 5; i++) {
    let x, y;
    let validPosition = false;

    //keep generating random positions until a valid one is found
    while (!validPosition) {
      x = Math.floor(Math.random() * columns);
      y = Math.floor(Math.random() * rows);
      //check valid position, so it does not spawn right in front or below snake
      if ((x === 0 && y === 1) || (x === 1 && y === 0) || (x === 0 && y === 0)) {
        continue; // skip the current iteration and generate new positions
      }
      //exclude cells that are within 2 cells of each other
      let isAdjacent = false;
      for (let j = 0; j < obstacles.length; j++) {
        const obstacle = obstacles[j];
        //returning the absolute value of the subtraction of both numbers
        const distanceX = Math.abs(obstacle.x - x);
        const distanceY = Math.abs(obstacle.y - y);
        if ((distanceX <= 2 && distanceY === 0) || (distanceY <= 2 && distanceX === 0)) {
          isAdjacent = true;
          break;
        }
      }
      if (!isAdjacent) {
        validPosition = true;
      }
    }
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
    if (!isOnSnake && !isOnApple) {
      const cell = document.getElementById(`${x} ${y}`);
      // set the class name to obstacle
      cell.className = 'obstacle';
      // add the obstacle coordinates to the 'obstacles' array, which is initialized as empty
      obstacles.push({ x: x, y: y });
      const obstacle = document.createElement('img');
      obstacle.src = '../Images/stone.png';
      cell.appendChild(obstacle);
    }
  }
}

function autoMoveSnake() {
  if (lastPressedDirection !== null && gamePaused!=true) {
    moveSnake(lastPressedDirection);
  }
}

function moveSnake(direction) {
  const head = snake[0]; // get the current head of the snake
  let x = head.x; // store the x-coordinate of the head
  let y = head.y; // store the y-coordinate of the head

  switch (direction) {
    case 'ArrowUp':
      x--; // Move the head one cell up (decrement x-coordinate)
      break;
    case 'ArrowDown':
      x++; // Move the head one cell down (increment x-coordinate)
      break;
    case 'ArrowLeft':
      y--; // Move the head one cell to the left (decrement y-coordinate)
      break;
    case 'ArrowRight':
      y++; // Move the head one cell to the right (increment y-coordinate)
      break;
  }

  if (isCollision(x, y) || isObstacleCollision(x, y)) {
  //game over logic here
   if (currentScore > highScore) {
    clearInterval(interval);
    // if we reached a new high score, set the innerHTML of the div to the new high score
    highScore = currentScore;
    highScoreDisplay.innerHTML = `High Score: ${highScore}`;
    // display the high score div
    newHigh();
  } else {
    // if not, just clear the interval and display the other div
    clearInterval(interval);
    lose();
  }
    return;
  }
  // the unshift method adds the x and y dictionary to the beginning of the snake array, so we can get the new position of the head
  snake.unshift({ x: x, y: y });
  const newHeadCell = document.getElementById(`${x} ${y}`);
  newHeadCell.style.backgroundColor = "rgba(32, 155, 33, 1)";

  // if the snakes head and the apple touch, increase the score
  if (x === apple.x && y === apple.y) {
    currentScore++;
    currentScoreDisplay.innerText = `Current Score: ${currentScore}`;
    // and generate a new apple
    generateApple();
  }
   else {
    // If snake doesn't eat apple, remove the tail aka the last element in the snake array
    const oldTail = snake.pop();
    const oldTailCell = document.getElementById(`${oldTail.x} ${oldTail.y}`);
    oldTailCell.removeAttribute('style');
  }
}
// see if the snake's head colided with an obstacle, used in the moveSnake function 
function isObstacleCollision(x, y) {
for (let i = 0; i < obstacles.length; i++) {
if (obstacles[i].x === x && obstacles[i].y === y) {
    return true;
  }
}
    return false;
}
// see if the snake's head colided with itself or with the boundaries
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

function resetPlayField() {
  clearInterval(interval);
  gamePaused=false;
  const notifications = document.getElementsByClassName('notification');
  for (let i = 0; i < notifications.length; i++) {
    notifications[i].style.display = "none";
  }
  lastPressedDirection = null;
  // Remove all styles and reset the snake to the initial position
  if(lastPressedDirection===null){
  for (let i = 0; i < snake.length; i++) {
    const cell = document.getElementById(`${snake[i].x} ${snake[i].y}`);
    cell.removeAttribute('style');
  }
  snake = [{ x: 0, y: 0 }];
  const snakeCell = document.getElementById(`${snake[0].x} ${snake[0].y}`);
  snakeCell.style.backgroundColor = "rgba(32, 155, 33, 1)";
}
  // Remove the apple and obstacles
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

  // Reset the currentScore
  currentScore = 0;
  currentScoreDisplay.innerText = `Current Score: ${currentScore}`;

  // Generate new apple and obstacles
  generateApple();
  generateObstacles();
  // reset the interval
  interval = setInterval(autoMoveSnake, 200);
}

function newHigh(){
  highS.style.display="block";
  //disable player movement
  document.removeEventListener("keydown", autoMoveSnake);
  // set gamePaused to true, so the autoMoveSnake function stops executing
  gamePaused=true;
}

function lose(){
  loss.style.display="block";
    //disable player movement
  document.removeEventListener("keydown", autoMoveSnake);
    // set gamePaused to true, so the autoMoveSnake function stops executing
  gamePaused=true;
}

//used for the buttons in the html code
function confirmInput(){
  let text = "Press OK to continue playing or Cancel to exit the site.";
  // confirm function returns true if OK is pressed, if so, the PlayField is reset
  if (confirm(text) == true) {
    resetPlayField();
  } else {
    // if the player clicks Cancel, the site is closed, by calling window.close
    window.close();
  }
}