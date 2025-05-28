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
    // Draw snake (as circles)
    for (let i = 0; i < snake.length; i++) {
        ctx.beginPath();
        ctx.arc(snake[i].x + box/2, snake[i].y + box/2, box/2 - 2, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#0c0' : '#0f0'; // 머리는 더 진하게
        ctx.fill();
        ctx.closePath();
        // Draw eyes on head
        if (i === 0) {
            drawEyes(snake[0]);
        }
    }
    // Draw food (circle)
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = '#f00';
    ctx.fill();
    ctx.closePath();
    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 25);
}

function drawEyes(head) {
    // 방향에 따라 눈 위치 조정
    let offset = 4;
    let x = head.x + box/2;
    let y = head.y + box/2;
    let dx = 0, dy = 0;
    if (direction === 'LEFT') dx = -offset;
    if (direction === 'RIGHT') dx = offset;
    if (direction === 'UP') dy = -offset;
    if (direction === 'DOWN') dy = offset;
    // 왼쪽 눈
    ctx.beginPath();
    ctx.arc(x - 4 + dx/2, y - 4 + dy/2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
    // 오른쪽 눈
    ctx.beginPath();
    ctx.arc(x + 4 + dx/2, y - 4 + dy/2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
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