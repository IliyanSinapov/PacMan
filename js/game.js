// Constants
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const _width = canvas.width = 23 * 16 * 2;
const _height = canvas.height = 23 * 16 * 2;

// Variables
var paused = true;
var gameOver = false;
var levelCompleted = false;
var isRemovingLife = false;
var level = 1;
var starting = false;


var maze = new Maze();
maze.init();
var coins;
var player = new Player(_width / 2 - 16, _height / 2 + 48, _width, _height, maze);


var blinky = new Ghost(11 * 32, 9 * 32, GhostImages[0], _width, _height, maze, player);
var pinky = new Ghost(11 * 32, 11 * 32, GhostImages[1], _width, _height, maze, player);
var kinky = new Ghost(13 * 32, 11 * 32, GhostImages[2], _width, _height, maze, player);
var clyde = new Ghost(9 * 32, 11 * 32, GhostImages[3], _width, _height, maze, player);

this.player.ghosts = [blinky, pinky, kinky, clyde];

// Functions
const update = () => {

    if (player.lives === 0) {
        gameOver = true;
        return;
    }

    player.update();
    blinky.update();
    pinky.update();
    kinky.update();
    clyde.update();

    document.getElementById("score").innerText = player.score;
}

const render = () => {
    maze.render(context);
    maze.coins.forEach(coin => {
        coin.render(context);
    });

    player.render(context);
    blinky.render(context);
    pinky.render(context);
    kinky.render(context);
    clyde.render(context);
}

const resetGhostImages = () => {
    GhostImages[0].src = 'assets/images/blinky.png';
    GhostImages[1].src = 'assets/images/pinky.png';
    GhostImages[2].src = 'assets/images/kinky.png';
    GhostImages[3].src = 'assets/images/clyde.png';
    GhostImages[4].src = 'assets/images/funky.png';
}

const restartLevel = () => {
    maze.init();
    resetGhostImages()
    currentScore = player.score;
    player = new Player(_width / 2 - 16, _height / 2 + 48, _width, _height, maze);
    player.score = currentScore;

    blinky = new Ghost(11 * 32, 9 * 32, GhostImages[0], _width, _height, maze, player);
    pinky = new Ghost(11 * 32, 11 * 32, GhostImages[1], _width, _height, maze, player);
    kinky = new Ghost(13 * 32, 11 * 32, GhostImages[2], _width, _height, maze, player);
    clyde = new Ghost(9 * 32, 11 * 32, GhostImages[3], _width, _height, maze, player);

    this.player.ghosts = [blinky, pinky, kinky, clyde];

    player.x = _width / 2 - 16;
    player.y = _height / 2 + 48;

    blinky.x = 11 * 32;
    blinky.y = 9 * 32;

    pinky.x = 11 * 32;
    pinky.y = 11 * 32;

    kinky.x = 13 * 32;
    kinky.y = 11 * 32;

    clyde.x = 9 * 32;
    clyde.y = 11 * 32;
}

// Event listeners
document.addEventListener('keydown', (event) => {

    const playerCoords = [player.x / 32, player.y / 32]

    if (!paused)
        switch (event.key) {
            case keyBindings.up:
                if (playerCoords[0] === Math.floor(playerCoords[0])) {
                    player.direction = Direction.UP;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.UP;
                break;

            case keyBindings.right:
                if (playerCoords[1] === Math.floor(playerCoords[1])) {
                    player.direction = Direction.RIGHT;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.RIGHT;
                break;

            case keyBindings.down:
                if (playerCoords[0] === Math.floor(playerCoords[0])) {
                    player.direction = Direction.DOWN;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.DOWN;
                break;

            case keyBindings.left:
                if (playerCoords[1] === Math.floor(playerCoords[1])) {
                    player.direction = Direction.LEFT;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.LEFT;
                break;
        }

    if (event.key === 'p') paused = !paused;
});

const gameLoop = () => {
    if (starting) return;

    if (paused) return;

    if (gameOver) {
        if (!isGameOver) {
            music.pause();
            renderGameOverScreen();
            music.play();
            requestAnimationFrame(gameLoop);
            return;
        }
        return;
    }

    if (player.animationIndex === 8 && !isRemovingLife) {
        isRemovingLife = true;
        setTimeout(() => {
            player.removeLife();
            document.getElementById("lives").removeChild(document.getElementById("lives").children[player.lives]);
            isRemovingLife = false;
        }, 300);
    }

    if (maze.coins.length === 0 && !levelCompleted) {
        levelCompleted = true;
        setTimeout(() => {
            restartLevel();

            level++;
            document.getElementById("level").innerText = level;

            levelCompleted = false;
        }, 300);
    }

    // Clear the canvas
    context.clearRect(0, 0, _width, _height);
    // Draw the background
    context.fillStyle = '#011011';
    context.fillRect(0, 0, _width, _height);

    update();
    render();

    requestAnimationFrame(gameLoop);
}

const start = () => {
    starting = true;
    restartLevel();
    render();
    music.pause();
    sounds.start.play();
    setTimeout(() => {
        paused = false;
        gameOver = false;
        music.src = "assets/sounds/game.mp3";
        music.loop = true;
        music.play();
        document.querySelector('.lives').innerHTML = `
                                        <img src="assets/images/heart.png" alt="lives">
                                        <img src="assets/images/heart.png" alt="lives">
                                        <img src="assets/images/heart.png" alt="lives">`;

        starting = false;

        gameLoop();
    }, 4600)
}