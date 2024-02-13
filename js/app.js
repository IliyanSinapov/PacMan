// Constants
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const _width = canvas.width = 23 * 16 * 2;
const _height = canvas.height = 23 * 16 * 2;

// Variables
var paused = false;

var maze = new Maze();
maze.init();
var coins;
var player = new Player(_width / 2 - 16, _height / 2 + 48, _width, _height, maze);

var blinky = new Ghost(11 * 32, 9 * 32, GhostImages[0], _width, _height, maze, player);
// var pinky = new Ghost(11 * 32, 11 * 32, GhostImages[1], _width, _height, maze, player);
// var kinky = new Ghost(13 * 32, 11 * 32, GhostImages[2], _width, _height, maze, player);
// var clyde = new Ghost(9 * 32, 11 * 32, GhostImages[3], _width, _height, maze, player);
// var funky = new Ghost(18 * 32, 19 * 32, GhostImages[4], _width, _height, maze, player);

let pathfindingInProgress = false;
let pendingPathCalculation = null;

// Functions
const update = () => {
    player.update();
    blinky.update();
    // pinky.update();
    // kinky.update();
    // clyde.update();
    // funky.update();

    coins = maze.coins;
}

const render = () => {
    maze.render(context);
    coins.forEach(coin => {
        coin.render(context);
    });

    player.render(context);
    blinky.render(context);
    // pinky.render(context);
    // kinky.render(context);
    // clyde.render(context);
    // funky.render(context);
}

// Event listeners
document.addEventListener('keydown', (event) => {

    const playerCoords = [player.x / 32, player.y / 32]

    if (!paused)
        switch (event.key) {
            case 'w':
                if (playerCoords[0] === Math.floor(playerCoords[0])) {
                    player.direction = Direction.UP;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.UP;
                break;

            case 'd':
                if (playerCoords[1] === Math.floor(playerCoords[1])) {
                    player.direction = Direction.RIGHT;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.RIGHT;
                break;

            case 's':
                if (playerCoords[0] === Math.floor(playerCoords[0])) {
                    player.direction = Direction.DOWN;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.DOWN;
                break;

            case 'a':
                if (playerCoords[1] === Math.floor(playerCoords[1])) {
                    player.direction = Direction.LEFT;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.LEFT;
                break;
        }

    if (event.key === 'p') paused = !paused;
});

setInterval(() => {
    if (paused) return;

    // Clear the canvas
    context.clearRect(0, 0, _width, _height);
    // Draw the background
    context.fillStyle = '#011011';
    context.fillRect(0, 0, _width, _height);

    update();
    render();
}, 1000 / 240);