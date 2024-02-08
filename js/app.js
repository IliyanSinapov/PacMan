const Player = await import("./entities.js").then(module => module.Player);
const Maze = await import("./entities.js").then(module => module.Maze);
const Direction = await import("./utils.js").then(module => module.Direction);


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

// Functions

const update = () => {
    player.update();

    coins = maze.coins;
}

const render = () => {
    maze.render(context);
    coins.forEach(coin => {
        coin.render(context);
    });

    player.render(context);
}

// Event listeners
document.addEventListener('keydown', (event) => {

    const playerCoords = [player.x / 32, player.y / 32]

    if (!paused)
        switch (event.key) {
            case 'w':
                if (playerCoords[0] === Math.floor(playerCoords[0])){
                    player.direction = Direction.UP;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.UP;
                break;

            case 'd':
                if (playerCoords[1] === Math.floor(playerCoords[1])){
                    player.direction = Direction.RIGHT;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.RIGHT;
                break;

            case 's':
                if (playerCoords[0] === Math.floor(playerCoords[0])){
                    player.direction = Direction.DOWN;
                    player.pendingDirection = null;
                } else player.pendingDirection = Direction.DOWN;
                break;

            case 'a':
                if (playerCoords[1] === Math.floor(playerCoords[1])){
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