const Player = await import("./entities.js").then(module => module.Player);


// Constants
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const mazeWidth = window.innerWidth - 25; // Set the desired width of the maze
const mazeHeight = window.innerHeight - 19; // Set the desired height of the maze

const _width = canvas.width = mazeWidth;
const _height = canvas.height = mazeHeight;


// Variables
var player = new Player(_width / 2 - 16, _height / 2 - 16);



// Functions

const update = () => {
    // player.update();
}

const render = () => {
    player.render(context);
}

setInterval(() => {
    context.clearRect(0, 0, _width, _height);
    
    update();
    render();
}, 1000 / 120);