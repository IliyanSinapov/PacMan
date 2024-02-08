const Direction = await import("./utils.js").then(module => module.Direction);
const Grid = await import("./utils.js").then(module => module.Grid);

class Player {
    constructor(x, y, _width, _height, maze) {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.movementSpeed = 2.5;
        this.hasHitWall = false;
        this.direction = Direction.LEFT;

        this._width = _width;
        this._height = _height;

        this.maze = maze;
        this.grid = maze.grid;

        this.pendingDirection = null;

        this.collectedCounsCount = 0;

        this.animationTick = 0;
        this.animationIndex = 0;
        this.animationSpeed = 2;

        this.spritesSrc = new Image();
        this.spritesSrc.src = `../assets/images/PacMan.png`
    }

    update() {
        this.updateAnimation();
        this.isCollidingWithWall();
        this.collectCoin();
        if (this.pendingDirection !== null) this.changeDirection();

        // Move player based on direction
        switch (this.direction) {
            case Direction.UP: this.y -= this.movementSpeed; break;
            case Direction.RIGHT: this.x += this.movementSpeed; break;
            case Direction.DOWN: this.y += this.movementSpeed; break;
            case Direction.LEFT: this.x -= this.movementSpeed; break;
        }

        // Check if player is out of playeable area
        if (this.x + this.size <= 0) this.x = this._width;
        else if (this.x >= this._width) this.x = 0;


        if (this.y <= 352)
            if (this.x + this.size <= 0) {
                this.x = this._width - 32;
                this.y = 352;
                this.direction = Direction.LEFT;
            }
        else if (this.y >= 384)
            if (this.x >= this._width) {
                this.x = 0;
                this.y = 352;
                this.direction = Direction.RIGHT;
            }
    }

    render(context) {
        context.save();

        // Draw player sprite based on direction and/or animation index
        if (this.hasHitWall) {
            switch (this.direction) {
                case Direction.UP:
                    /* 
                        Translate to the center of the player, rotate the context, draw the sprite, and then rotate the context back
                        This is done to ensure the sprite is drawn facing the correct direction
                        The same is done for the other directions
                     */
                    context.translate(this.x + 32, this.y + 32);
                    context.rotate(Math.PI / -2);
                    context.drawImage(this.spritesSrc, 192, 0, 32, 32, 32, 0, -32, -32);
                    break;
                case Direction.RIGHT:
                    context.drawImage(this.spritesSrc, 192, 0, 32, 32, this.x, this.y, 32, 32);
                    break;
                case Direction.DOWN:
                    context.translate(this.x + 32, this.y + 32);
                    context.rotate(Math.PI / 2);
                    context.drawImage(this.spritesSrc, 192, 0, 32, 32, -32, 0, 32, 32);
                    break;
                case Direction.LEFT:
                    context.scale(-1, 1);
                    context.drawImage(this.spritesSrc, 192, 0, 32, 32, -this.x - 32, this.y, 32, 32);
                    break;
            }
        } else {
            switch (this.direction) {
                case Direction.UP:
                    context.translate(this.x + 32, this.y + 32);
                    context.rotate(Math.PI / -2);
                    context.drawImage(this.spritesSrc, this.animationIndex * 32, 0, 32, 32, 32, 0, -32, -32);
                    break;

                case Direction.RIGHT:
                    context.drawImage(this.spritesSrc, this.animationIndex * 32, 0, 32, 32, this.x, this.y, 32, 32);
                    break;

                case Direction.DOWN:
                    context.translate(this.x + 32, this.y + 32);
                    context.rotate(Math.PI / 2);
                    context.drawImage(this.spritesSrc, this.animationIndex * 32, 0, 32, 32, -32, 0, 32, 32);
                    break;

                case Direction.LEFT:
                    context.scale(-1, 1);
                    context.drawImage(this.spritesSrc, this.animationIndex * 32, 0, 32, 32, -this.x - 32, this.y, 32, 32);
                    break;
            }
        }

        context.restore();
    }

    changeDirection() {
        const playerCoords = [Math.round(this.x / 32), Math.round(this.y / 32)];

        // Check if the player is at the center of a cell and if so, change direction
        switch (this.pendingDirection) {

            /*
                Checks wether a cell adjacent to the player in a certain direction ( depernding on pendingDirection ) is a wall
                If there are no walls adjacebt to the player ( depending on pendingDirection ) then the player will change direction unless pendingDirection is null
            */

            case Direction.UP:
                /*
                    Checks the direction that the player is currently moving in
                    and if a cell adjacent to the player in the direction of pendingDirection is not a wall, then the player will change direction
                    unless pendingDirection is null
                */
                if (this.direction === Direction.LEFT) {
                    if (this.grid[playerCoords[1] - 1][playerCoords[0]] !== 1) {
                        this.direction = this.pendingDirection;
                        this.pendingDirection = null;
                        this.x = playerCoords[0] * 32;
                    }
                } else if (this.direction === Direction.RIGHT) {
                    if (this.grid[playerCoords[1] - 1][playerCoords[0]] !== 1) {
                        this.direction = this.pendingDirection;
                        this.pendingDirection = null;
                        this.x = playerCoords[0] * 32;
                    }
                }
                break;
            case Direction.RIGHT:
                if (this.direction === Direction.DOWN) {
                    if (this.grid[playerCoords[1]][playerCoords[0] + 1] !== 1) {
                        this.direction = this.pendingDirection;
                        this.pendingDirection = null;
                        this.y = playerCoords[1] * 32;
                    }
                } else if (this.direction === Direction.UP) {
                    if (this.grid[playerCoords[1]][playerCoords[0] + 1] !== 1) {
                        this.y = playerCoords[1] * 32;
                        this.direction = this.pendingDirection;
                        this.pendingDirection = null;
                    }
                }
                break;
            case Direction.DOWN:
                if (this.direction === Direction.LEFT) {
                    if (this.grid[playerCoords[1] + 1][playerCoords[0]] !== 1) {
                        this.direction = this.pendingDirection;
                        this.pendingDirection = null;
                        this.x = playerCoords[0] * 32;
                    }
                } else if (this.direction === Direction.RIGHT) {
                    if (this.grid[playerCoords[1] - 1][playerCoords[0]] !== 1) {
                        this.direction = this.pendingDirection;
                        this.pendingDirection = null;
                        this.x = playerCoords[0] * 32;
                    }
                }
                break;
            case Direction.LEFT:
                if (this.direction === Direction.DOWN) {
                    if (this.grid[playerCoords[1]][playerCoords[0] - 1] !== 1) {
                        this.direction = this.pendingDirection;
                        this.pendingDirection = null;
                        this.y = playerCoords[1] * 32;
                    }
                } else if (this.direction === Direction.UP) {
                    if (this.grid[playerCoords[1]][playerCoords[0] - 1] !== 1) {
                        this.direction = this.pendingDirection;
                        this.pendingDirection = null;
                        this.y = playerCoords[1] * 32;
                    }
                }
                break;
        }
    }

    collectCoin() {
        const playerCoords = [Math.floor(this.x / 32), Math.floor(this.y / 32)];

        if (this.grid[playerCoords[1]][playerCoords[0]] === 0) {
            this.grid[playerCoords[1]][playerCoords[0]] = 3;
            this.collectedCounsCount++;

            this.maze.removeCoin(playerCoords[0], playerCoords[1]);
        }
    }

    // Check if player is colliding with a wall
    isCollidingWithWall() {
        let nextCells = null;

        let playerCoords = [this.x / 32, this.y / 32];

        /*
            Checks if a cell adjacent to the player ( in the direction the player is moving in ) is a wall
            If the cell is a wall, then the player will stop moving and the player's position will be set to the edge of the wall
            And hasHitWall will be set to true to stop the player from updating the animation and to draw the correct sprite based on the direction the player was lastly moving in
            Also checks if the player is about to glitch through a wall and if so, stop the player from moving and set the player's position to the edge of the wall
        */
        switch (this.direction) {
            case Direction.UP:
                // Checks if the cell above the player is outside of the playeable area; if so, set nextCells to 1
                if (Math.floor(this.y / 32) - 1 !== -1)
                    nextCells = this.grid[Math.floor(this.y / 32) - 1][Math.floor(this.x / 32)];
                else nextCells = 1;
                break;
            case Direction.RIGHT:
                nextCells = this.grid[Math.floor(this.y / 32)][Math.floor(this.x / 32) + 1];
                break;
            case Direction.DOWN:
                nextCells = this.grid[Math.floor(this.y / 32) + 1][Math.floor(this.x / 32)];
                break;
            case Direction.LEFT:
                nextCells = this.grid[Math.floor(this.y / 32)][Math.floor(this.x / 32) - 1];
                break;
        }

        // If the player is about to hit a wall, stop the player from moving and set the player's position to the edge of the wall
        if (nextCells === 1) {
            if (this.pendingDirection === null) {
                if (this.direction === Direction.UP && playerCoords[1] === Math.floor(playerCoords[1])) {
                    this.movementSpeed = 0;
                    this.hasHitWall = true;
                } else if (this.direction === Direction.RIGHT && playerCoords[0] === Math.floor(playerCoords[0])) {
                    this.movementSpeed = 0;
                    this.hasHitWall = true;
                } else if (this.direction === Direction.DOWN) {
                    this.movementSpeed = 0;
                    this.hasHitWall = true;
                } else if (this.direction === Direction.LEFT && playerCoords[0] === Math.floor(playerCoords[0])) {
                    this.movementSpeed = 0;
                    this.hasHitWall = true;
                }
            }
        } else {
            this.movementSpeed = 2.5;
            this.hasHitWall = false;
        }

        this.checkIfGlitchingThroughWall();
    }

    // Check if the player is glitching through the wall and if so, stop the player from moving and set the player's position to the edge of the wall
    checkIfGlitchingThroughWall() {
        let playerCoords = [this.x / 32, this.y / 32];
        if (this.grid[Math.round(playerCoords[1])][Math.round(playerCoords[0])] === 1) {
            switch (this.direction) {
                case Direction.UP:
                    if (this.grid[Math.round(playerCoords[1])][Math.round(playerCoords[0])] === 1) {
                        this.x = Math.round(playerCoords[0]) * 32;
                        this.y = Math.round(playerCoords[1] + 1) * 32;
                        this.movementSpeed = 0;
                    }
                    break;
                case Direction.RIGHT:
                    if (this.grid[Math.round(playerCoords[1])][Math.round(playerCoords[0])] === 1) {
                        this.x = Math.round(playerCoords[0] - 1) * 32;
                        this.y = Math.round(playerCoords[1]) * 32;
                        this.movementSpeed = 0;
                    }
                    break;
                case Direction.DOWN:
                    if (this.grid[Math.round(playerCoords[1])][Math.round(playerCoords[0])] === 1) {
                        this.x = Math.round(playerCoords[0]) * 32;
                        this.y = Math.round(playerCoords[1] - 1) * 32;
                        this.movementSpeed = 0;
                    }
                    break;
                case Direction.LEFT:
                    if (this.grid[Math.round(playerCoords[1])][Math.round(playerCoords[0])] === 1) {
                        this.x = Math.round(playerCoords[0] + 1) * 32;
                        this.y = Math.round(playerCoords[1]) * 32;
                        this.movementSpeed = 0;
                    }
                    break;
            }
        }
    }

    // Update player animation
    updateAnimation() {

        /*
            Animation index is used to determine which sprite from the sprite sheet to draw
            Animation tick is used to determine when to update the animation index
            Animation speed is used to determine how often/quickly to draw the next sprite
        */

        // If the player has hit a wall, do not update the animation
        if (this.hasHitWall == true) return;

        this.animationTick++;

        // If animation tick is greater than animation speed, update animation index
        if (this.animationTick >= this.animationSpeed) {
            this.animationTick = 0;

            this.animationIndex++;

            if (this.animationIndex >= 7) {
                this.animationIndex = 0;
            }
        }
    }
}

class Wall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.texture = new Image();
        this.texture.src = "../assets/images/Wall.png";
    }
}

class Maze {
    constructor() {
        this.grid = Grid;
        this.walls = [];
        this.coins = [];
        this.playerCoords = {
            x: 0,
            y: 0
        }
    }

    // Initialize the maze and create walls based on the grid array
    init() {

        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === 1) {
                    this.walls.push(new Wall(x * 32, y * 32));
                }

                if (this.grid[y][x] === 0) {
                    this.coins.push(new Coin(x * 32, y * 32));
                }

                if (this.grid[y][x] === 5) {
                    this.playerCoords.x = y;
                    this.playerCoords.y = x;
                }
            }
        }
    }

    removeCoin(x, y) {
        this.coins = [];
        for (let y = 0; y < this.grid.length; y++)
            for (let x = 0; x < this.grid[y].length; x++)
                if (this.grid[y][x] === 0)
                    this.coins.push(new Coin(x * 32, y * 32));

        console.log("coin removed!")
    }

    // Render the maze walls based on the walls array
    render(context) {
        for (let i = 0; i < this.walls.length; i++) {
            context.drawImage(this.walls[i].texture, this.walls[i].x, this.walls[i].y, this.walls[i].size, this.walls[i].size);
        }
    }
}

class Ghost {
    construcotr(x, y, color) {
        this.x = x;
        this.y = y;
        this.direction = Direction.LEFT;

        this.animationTick = 0;
        this.animationIndex = 0;
        this.animationSpeed = 2;

        this.spriteSrc = `../assets/images${color}Ghost.png`;
    }

    updateAnimation() {
        this.animationTick++;

        if (this.animationTick >= this.animationSpeed) {
            this.animationTick = 0;

            this.animationIndex++;

            if (this.animationIndex >= 2) {
                this.animationIndex = 0;
            }
        }
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.texture = new Image();
        this.texture.src = "../assets/images/Coin.png";

        this.animationTick = 0;
        this.animationIndex = 0;
        this.animationSpeed = 60;
    }

    render(context) {
        this.updateAnimation();

        context.drawImage(this.texture, this.animationIndex * 32, 0, 32, 32, this.x, this.y, 32, 32);
    }

    updateAnimation() {
        this.animationTick++;

        if (this.animationTick >= this.animationSpeed) {
            this.animationTick = 0;

            this.animationIndex++;

            if (this.animationIndex >= 5) {
                this.animationIndex = 0;
            }
        }
    }
}

class Pill {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.spritesSrc = "../assets/imagesPill.png";
    }
}

export { Player, Ghost, Coin, Pill, Maze, Wall };