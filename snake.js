const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = spawnFood();
let score = 0;
let gameInterval;

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // Draw snake
    ctx.fillStyle = '#0f0';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, box, box);
    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 25);
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function update() {
    if (!direction) {
        draw();
        return;
    }
    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // Wall collision
    if (
        head.x < 0 || head.x >= canvasSize ||
        head.y < 0 || head.y >= canvasSize ||
        collision(head, snake)
    ) {
        clearInterval(gameInterval);
        alert('게임 오버! 점수: ' + score);
        document.location.reload();
        return;
    }

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawnFood();
    } else {
        snake.pop();
    }
    snake.unshift(head);
    draw();
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

draw();
gameInterval = setInterval(update, 120);