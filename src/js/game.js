const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdX = 70;
let birdY = 200;
let birdRadius = 15;
let gravity = 0.42;
let lift = -7.2;
let velocity = 0;

let obstacles = [];
let obsWidth = 50;
let obsGap = 140;
let obsSpeed = 3.0;
let frameCount = 0;
let score = 0;
let isGameOver = false;

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        e.preventDefault();
        if (isGameOver) {
            resetGame();
        } else {
            velocity = lift;
        }
    }
});

canvas.addEventListener("click", function() {
    if (isGameOver) {
        resetGame();
    } else {
        velocity = lift;
    }
});

function resetGame() {
    birdY = 200;
    velocity = 0;
    obstacles = [];
    score = 0;
    frameCount = 0;
    isGameOver = false;
    loop();
}

function spawnObstacle() {
    let minHeight = 50;
    let maxHeight = canvas.height - obsGap - 50;
    let height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    obstacles.push({
        x: canvas.width,
        top: height,
        bottom: canvas.height - height - obsGap,
        passed: false
    });
}

function update() {
    if (isGameOver) return;

    velocity += gravity;
    birdY += velocity;

    if (frameCount % 95 === 0) {
        spawnObstacle();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obsSpeed;

        if (
            birdX + birdRadius > obstacles[i].x &&
            birdX - birdRadius < obstacles[i].x + obsWidth &&
            (birdY - birdRadius < obstacles[i].top || birdY + birdRadius > canvas.height - obstacles[i].bottom)
        ) {
            triggerGameOver();
        }

        if (!obstacles[i].passed && obstacles[i].x + obsWidth < birdX) {
            score++;
            obstacles[i].passed = true;
        }

        if (obstacles[i].x + obsWidth < 0) {
            obstacles.splice(i, 1);
        }
    }

    if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
        triggerGameOver();
    }

    frameCount++;
}

function triggerGameOver() {
    if (!isGameOver) {
        isGameOver = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pilares de fuego / lava del infierno
    ctx.fillStyle = '#ff3300';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff4500';
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, 0, obsWidth, obstacles[i].top);
        ctx.fillRect(obstacles[i].x, canvas.height - obstacles[i].bottom, obsWidth, obstacles[i].bottom);
    }
    ctx.shadowBlur = 0;

    // Pájaro de fuego (Fénix Infernal)
    ctx.fillStyle = '#ffcc00';
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#ff5500';
    ctx.beginPath();
    ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Pico flamígero
    ctx.fillStyle = '#ff2200';
    ctx.beginPath();
    ctx.moveTo(birdX + birdRadius, birdY);
    ctx.lineTo(birdX + birdRadius + 12, birdY - 5);
    ctx.lineTo(birdX + birdRadius, birdY + 5);
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Puntuación de Magma
    ctx.fillStyle = '#ff9900';
    ctx.font = 'bold 22px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`MAGMA: ${score}`, canvas.width / 2, 40);

    if (isGameOver) {
        ctx.fillStyle = 'rgba(20, 2, 2, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff3300';
        ctx.font = 'bold 26px Courier New';
        ctx.fillText('INCINERADO', canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = '#ffcc00';
        ctx.font = '14px Courier New';
        ctx.fillText('Clic o ESPACIO para renacer', canvas.width / 2, canvas.height / 2 + 25);
    }
}

function loop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(loop);
    }
}

loop();