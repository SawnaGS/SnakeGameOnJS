function gameLoop() {
  const gameField = document.getElementById("game-field");
  const context = gameField.getContext("2d");

  const gridSize = 50;
  const rows = gameField.height / gridSize;
  const cols = gameField.width / gridSize;

  let snake = [];
  snake[0] = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };

  let direction = "right";
  let lastDirection = "right";
  let isPaused = false;
  document.addEventListener("keydown", function (event) {
    if (
      (event.code === "ArrowUp" || event.code === "KeyW") &&
      lastDirection !== "down"
    ) {
      direction = "up";
    } else if (
      (event.code === "ArrowDown" || event.code === "KeyS") &&
      direction !== "up"
    ) {
      direction = "down";
    } else if (
      (event.code === "ArrowLeft" || event.code === "KeyA") &&
      lastDirection !== "right"
    ) {
      direction = "left";
    } else if (
      (event.code === "ArrowRight" || event.code === "KeyD") &&
      lastDirection !== "left"
    ) {
      direction = "right";
    }
    if (event.code === "Escape" || event.code === "Space") {
      isPaused = !isPaused;
    }
  });

  function moveSnake() {
    lastDirection = direction;
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }
    switch (direction) {
      case "up":
        snake[0].y = (snake[0].y - 1 + rows) % rows;
        break;
      case "down":
        snake[0].y = (snake[0].y + 1) % rows;
        break;
      case "left":
        snake[0].x = (snake[0].x - 1 + cols) % cols;
        break;
      case "right":
        snake[0].x = (snake[0].x + 1) % cols;
        break;
    }
  }
  function drawSnake() {
    context.fillStyle = "green";
    snake.forEach((segment) => {
      context.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
    });
    context.fillStyle = "lime";
    context.fillRect(
      snake[0].x * gridSize,
      snake[0].y * gridSize,
      gridSize,
      gridSize
    );
  }

  let food = generateFood();
  let score = 0;
  let maxScore = rows * cols - 1;

  function isFoodInsideSnake(newFood, snake) {
    for (let i = 0; i < snake.length; i++) {
      if (newFood.x === snake[i].x && newFood.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }

  function generateFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
    } while (isFoodInsideSnake(newFood, snake));
    return newFood;
  }

  function drawFood() {
    context.fillStyle = "red";
    context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }

  function checkIfFoodIsEaten() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
      let newSegment = { x: food.x, y: food.y };
      snake.push(newSegment);
      food = generateFood();
      score++;
    }
  }

  function checkIfTheGameIsOver() {
    if (score === maxScore) {
      clearInterval(gameInterval);
      alert("Wictory");
    }
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
        clearInterval(gameInterval);
        alert("Game over");
      }
    }
  }

  function drawGame() {
    context.clearRect(0, 0, gameField.width, gameField.height);
    drawSnake();
    drawFood();
    document.getElementById("score").innerHTML = score;
  }

  function updateGame() {
    if (isPaused) {
      return;
    }
    moveSnake();
    checkIfTheGameIsOver();
    checkIfFoodIsEaten();
    drawGame();
  }

  let gameSpeed = 100;
  let gameInterval = setInterval(updateGame, gameSpeed);

  function restartGame() {
    clearInterval(gameInterval);
    context.clearRect(0, 0, gameField.width, gameField.height);
    snake = [];
    snake[0] = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
    direction = "right";
    food = generateFood();
    score = 0;
    gameInterval = setInterval(updateGame, gameSpeed);
  }
  const restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", restartGame);
}

gameLoop();

const helpButton = document.getElementById("help-button");
let controlInstructions = document.getElementById("control-instructions");

helpButton.addEventListener("click", function () {
  if (controlInstructions.style.visibility === "hidden") {
    controlInstructions.style.visibility = "visible";
  } else controlInstructions.style.visibility = "hidden";
});
