// ================== CANVAS ==================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ================== AUDIO ==================
const bgMusic = new Audio("audio.mp3");
const eatSound = new Audio("orb.mp3");
const clickSound = new Audio("nabrak.mp3");
const crashSound = new Audio("nabrak.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.4;
eatSound.volume = 0.8;
clickSound.volume = 0.7;
crashSound.volume = 0.9;

// ================== KONFIGURASI GAME ==================
const box = 15;
const speed = 150;
const deadZone = 0.4;

// ================== VARIABEL GAME ==================
let snake;
let direction;
let food;
let game;
let score = 0;
let playerName = "";

// ================== START GAME ==================
function startGame() {

    clickSound.currentTime = 0;
    clickSound.play();

    const nameInput = document.getElementById("playerName").value.trim();

    if (!nameInput) {
        alert("Nama wajib diisi!");
        return;
    }

    playerName = nameInput;
    document.getElementById("playerLabel").innerText = playerName;

    document.getElementById("landing").style.display = "none";
    document.getElementById("gamePage").style.display = "block";

    bgMusic.play().catch(() => {}); // hindari error autoplay

    initGame();
}

// ================= INIT GAME =================
function initGame() {

    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";

    score = 0;
    document.getElementById("score").innerText = score;

    food = spawnFood();

    game = setInterval(draw, speed);
    requestAnimationFrame(gamepadLoop);
}

// ================== SPAWN FOOD ==================
function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// ================== SET ARAH ==================
function setDirection(dir) {

    clickSound.currentTime = 0;
    clickSound.play();

    if (dir === "LEFT" && direction !== "RIGHT") direction = dir;
    if (dir === "RIGHT" && direction !== "LEFT") direction = dir;
    if (dir === "UP" && direction !== "DOWN") direction = dir;
    if (dir === "DOWN" && direction !== "UP") direction = dir;
}

// ================== KEYBOARD ==================
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") setDirection("UP");
    if (e.key === "ArrowDown") setDirection("DOWN");
    if (e.key === "ArrowLeft") setDirection("LEFT");
    if (e.key === "ArrowRight") setDirection("RIGHT");
});

// ================== GAMEPAD ==================
function gamepadLoop() {
    const pads = navigator.getGamepads();

    for (let gp of pads) {
        if (!gp) continue;

        const x = gp.axes[0];
        const y = gp.axes[1];

        if (x < -deadZone) setDirection("LEFT");
        if (x > deadZone) setDirection("RIGHT");
        if (y < -deadZone) setDirection("UP");
        if (y > deadZone) setDirection("DOWN");

        if (gp.buttons[12]?.pressed) setDirection("UP");
        if (gp.buttons[13]?.pressed) setDirection("DOWN");
        if (gp.buttons[14]?.pressed) setDirection("LEFT");
        if (gp.buttons[15]?.pressed) setDirection("RIGHT");
    }

    requestAnimationFrame(gamepadLoop);
}

// ================== DRAW GAME ==================
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#00ff99" : "#fff";
        ctx.fillRect(s.x, s.y, box, box);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;

    // === TABRAKAN ===
    if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        snake.slice(1).some(s => s.x === head.x && s.y === head.y)
    ) {
        gameOver();
        return;
    }

    // === MAKAN ===
    if (head.x === food.x && head.y === food.y) {

        eatSound.currentTime = 0;
        eatSound.play();

        score++;
        document.getElementById("score").innerText = score;
        food = spawnFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// =================== GAME OVER ===================
function gameOver() {

    clearInterval(game);

    bgMusic.pause();
    bgMusic.currentTime = 0;

    crashSound.currentTime = 0;
    crashSound.play();

    const data = JSON.parse(localStorage.getItem("snakeScores")) || [];
    data.push({ name: playerName, score });
    localStorage.setItem("snakeScores", JSON.stringify(data));

    setTimeout(() => {
        alert(`Game Over\n${playerName} : ${score}`);
        location.reload();
    }, 600);
}

// =================== RIWAYAT SKOR ===================
function loadHistory() {
    const data = JSON.parse(localStorage.getItem("snakeScores")) || [];
    const list = document.getElementById("scoreHistory");
    list.innerHTML = "";

    data.slice(-5).reverse().forEach(d => {
        const li = document.createElement("li");
        li.innerText = `${d.name} : ${d.score}`;
        list.appendChild(li);
    });
}

// =================== RESET RIWAYAT ===================
function resetHistory() {

    clickSound.currentTime = 0;
    clickSound.play();

    if (confirm("Hapus semua riwayat skor?")) {
        localStorage.removeItem("snakeScores");
        loadHistory();
    }
}

loadHistory();