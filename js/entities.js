const worker = new Worker("js/pathfinder.js");

class Player {
    constructor(x, y, _width, _height, maze) {

        this.startingPosition = { x, y };

        this.x = x;
        this.y = y;
        this.size = 32;
        this.movementSpeed = 2.5;
        this.hasHitWall = false;
        this.direction = Direction.LEFT;

        this.maze = maze;
        this.grid = maze.grid;

        this.hasHitGhost = false;
        this.hasEatenPill = false;
        this.ghostsEatenInARow = 0;

        this.ghosts = [];
        this.pills = this.maze.pills;
        this.coins = this.maze.coins;

        this._width = _width;
        this._height = _height;

        this.playerCoordsWithinGrid = [Math.round(this.x / 32), Math.round(this.y / 32)];

        this.pendingDirection = null;

        this.score = 0;
        this.lives = 3;

        this.animationTick = 0;
        this.animationIndex = 0;
        this.animationSpeed = 2;

        this.spritesSrc = new Image();
        this.spritesSrc.src = `../assets/images/PacMan.png`
    }

    update() {
        this.updateAnimation();
        if (this.hasHitGhost === false)
            this.checkIfHasHitGhost();
        this.checkIfHasEatenPill();
        this.isCollidingWithWall();
        this.collectCoin();
        if (this.pendingDirection !== null) this.changeDirection();

        if (this.hasEatenPill === true)
            if (this.timer % 600 === 0) {
                this.ghostsEatenInARow = 0;
                this.hasEatenPill = false;
            }

        if (this.hasHitGhost === true && this.hasEatenPill === false) {
            this.animationSpeed = 12;
            this.spritesSrc.src = `../assets/images/PacManDead.png`
        }

        if (this.hasHitGhost === true && this.hasEatenPill === false) this.movementSpeed = 0;

        // Move player based on direction
        switch (this.direction) {
            case Direction.UP: this.y -= this.movementSpeed; break;
            case Direction.RIGHT: this.x += this.movementSpeed; break;
            case Direction.DOWN: this.y += this.movementSpeed; break;
            case Direction.LEFT: this.x -= this.movementSpeed; break;
        }

        this.playerCoordsWithinGrid = [Math.round(this.x / 32), Math.round(this.y / 32)];

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
        if (this.hasHitGhost === false) {
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
        } else if (this.hasHitGhost === true && this.hasEatenPill === false) {
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

    checkIfHasHitGhost() {
        for (let i = 0; i < this.ghosts.length; i++) {
            const ghost = this.ghosts[i];

            if (this.x + 10 < ghost.x + ghost.size &&
                this.x + this.size - 10 > ghost.x &&
                this.y + 10 < ghost.y + ghost.size &&
                this.y + this.size - 10 > ghost.y) {
                if (ghost.isScared === true) {
                    this.ghostsEatenInARow++;
                    this.score += 200 + Math.pow(2, this.ghostsEatenInARow - 1);
                    this.ghosts[i].isScared = false;
                    this.ghosts[i].x = this.ghosts[i].startingPosition.x;
                    this.ghosts[i].y = this.ghosts[i].startingPosition.y;
                    this.ghosts[i].direction = Direction.RIGHT;
                    this.ghosts[i].isHunting = false;
                    this.ghosts[i].needsNewPath = false;
                    this.ghosts[i].path = null;
                    this.ghosts[i].hasReachedPlayer = false;
                    this.timer = 0;
                    sounds.ateAGhost.play();
                    continue;
                }

                if (ghost.isScared === false) {
                    this.ghosts[i].hasReachedPlayer = true;
                    this.hasHitGhost = true;
                    sounds.died.play();
                    this.animationIndex = 0;
                    this.timer = 0;
                }
            }
        }
    }

    removeLife() {
        this.lives--;
        this.x = this.startingPosition.x;
        this.y = this.startingPosition.y;
        this.hasHitGhost = false;
        this.direction = Direction.LEFT;
        this.animationIndex = 0;
        this.animationSpeed = 2;
        this.spritesSrc.src = `../assets/images/PacMan.png`


        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].x = this.ghosts[i].startingPosition.x;
            this.ghosts[i].y = this.ghosts[i].startingPosition.y;
            this.ghosts[i].direction = Direction.RIGHT;
            this.ghosts[i].isHunting = false;
            this.ghosts[i].needsNewPath = false;
            this.ghosts[i].path = null;
            this.ghosts[i].hasReachedPlayer = false;
        }
    }

    checkIfHasEatenPill() {
        for (let i = 0; i < this.maze.pills.length; i++) {
            const pill = this.pills[i];

            if (this.x + 10 < pill.x + pill.size &&
                this.x + this.size - 10 > pill.x &&
                this.y + 10 < pill.y + pill.size &&
                this.y + this.size - 10 > pill.y) {
                this.hasEatenPill = true;
                this.score += 50;

                this.maze.pills.splice(i, 1);

                this.timer = 0;

                for (let i = 0; i < this.ghosts.length; i++) {
                    this.ghosts[i].isScared = true;
                    this.ghosts[i].isHunting = false;
                    this.ghosts[i].timer = 1;
                    this.ghosts[i].path = null;

                    sounds.powerUp.play();
                }
            }
        }
    }

    collectCoin() {
        for (let i = 0; i < this.coins.length; i++) {
            const coin = this.coins[i];

            if (this.x + 10 < coin.x + coin.size &&
                this.x + this.size - 10 > coin.x &&
                this.y + 10 < coin.y + coin.size &&
                this.y + this.size - 10 > coin.y) {
                this.maze.coins.splice(i, 1);
                sounds.wakaWaka.play();
                this.score += 10;
            }
        }
    }

    // Check if player is colliding with a wall
    isCollidingWithWall() {
        let nextCells = isCNextCellAWall({ x: this.x, y: this.y }, this.direction);
        let playerCoords = [this.x / 32, this.y / 32];

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

        const isGlitchingThrough = checkIfGlitchingThroughWall({ x: this.x / 32, y: this.y / 32 }, this.direction);

        if (isGlitchingThrough === null) return

        this.x = isGlitchingThrough.x;
        this.y = isGlitchingThrough.y;
        this.movementSpeed = isGlitchingThrough.movementSpeed;
    }

    // Update player animation
    updateAnimation() {

        /*
            Animation index is used to determine which sprite from the sprite sheet to draw
            Animation tick is used to determine when to update the animation index
            Animation speed is used to determine how often/quickly to draw the next sprite
        */

        // If the player has hit a wall, do not update the animation
        if (this.hasHitGhost === false)
            if (this.hasHitWall == true) return;

        this.animationTick++;

        // If animation tick is greater than animation speed, update animation index
        if (this.animationTick >= this.animationSpeed) {
            this.animationTick = 0;

            this.animationIndex++;

            if (this.animationIndex >= 7 && this.hasHitGhost === false) {
                this.animationIndex = 0;
            } else if (this.animationIndex > 7 && this.hasHitGhost === true && this.hasEatenPill === false) return;
        }
    }
}

class Ghost {
    constructor(x, y, image, _width, _height, maze, player) {

        this.startingPosition = { x, y };

        this.x = Math.round(x / 32) * 32;
        this.y = Math.round(y / 32) * 32;
        this.sprite = image;
        this.normalSprite = image.src;
        this.size = 32;

        this._width = _width;
        this._height = _height;

        this.maze = maze;
        this.grid = this.maze.grid;
        this.floodFillGrid = this.maze.grid;

        this.player = player;

        this.isScared = false;
        this.isFarFromPlayer = false;
        this.isHunting = false;
        this.hasReachedPlayer = false;
        this.path = null;
        this.needsNewPath = false;

        this.direction = Direction.RIGHT
        this.pendingDirections = [];
        this.movementSpeed = 2.5;
        this.movementSpeedMultiplier = 1;

        this.animationTick = 0;
        this.animationIndex = 0;
        this.animationSpeed = 12;

        this.hasHitWall = false;

        // timer that is used to make desicions based on time/updates passed (example - every 300 updates the ghost decides wether to hunt or not the player)
        this.huntingIntervals = 0;
        this.timer = 1;
    }

    update() {
        this.updateAnimation();
        this.manageHunting();
        this.move();
        this.isCollidingWithWall();

        if (this.isScared === true) {
            this.sprite.src = "../assets/images/ghostScared.png"
            sounds.ghostScared.play();
        }
        else {
            this.sprite.src = this.normalSprite;
            sounds.ghostScared.pause();
        }

        if (this.x <= 0) this.x = this._width;
        else if (this.x >= this._width) this.x = 0;

        if (this.y <= 352) {
            if (this.x + this.size <= 0) {
                this.x = this._width - 32;
                this.y = 352;
                this.direction = Direction.LEFT;
            }
        }
        else if (this.y >= 384) {
            if (this.x >= this._width) {
                this.x = 0;
                this.y = 352;
                this.direction = Direction.RIGHT;
            }
        }
    }

    render(context) {

        if (this.hasHitWall === false)
            context.drawImage(this.sprite, this.animationIndex * 31, 0, 32, 32, this.x, this.y, 32, 32);
        else
            context.drawImage(this.sprite, 0, 0, 32, 32, this.x, this.y, 32, 32);


    }

    manageHunting() {
        this.huntingIntervals++;

        if (this.isScared === false)
            if (this.huntingIntervals % 300 == 0 && this.isHunting === false) {
                this.huntingIntervals = 1;
                this.isHunting = Boolean(Math.round(Math.random()));
            }

        if (this.isHunting === true || this.isScared === true) {
            this.needsNewPath = true;
            this.findPath();

            if (this.isFarFromPlayer === true)
                this.path = null;
        }

        if (this.isHunting && this.huntingIntervals % 1000 === 0) {
            this.isHunting = false;
            this.needsNewPath = false;
            this.path = null;
            this.huntingIntervals = 1;
            const pendDir = this.direction;
            this.direction = null;
            this.x = Math.round(this.x / 32) * 32;
            this.y = Math.round(this.y / 32) * 32;
            this.direction = pendDir;
        } else if (this.hasReachedPlayer === true) {
            this.isHunting = false;
            this.huntingIntervals = 1;
            this.x = Math.round(this.x / 32) * 32
            this.y = Math.round(this.y / 32) * 32
            this.needsNewPath = false;
        }

        if (this.isScared === true) {
            if (this.timer % 600 === 0) {
                this.isScared = false;
            }
        }
    }

    findPath() {

        worker.postMessage({
            start: {
                x: Math.round(this.x / 32),
                y: Math.round(this.y / 32)
            },
            goal: {
                x: Math.round(this.player.x / 32),
                y: Math.round(this.player.y / 32)
            },
            grid: this.maze.grid
        });

        worker.onmessage = (event) => {
            this.path = event.data;
        }
    }

    move() {
        if (this.path !== null && (this.isHunting === true || this.isScared === true)) {
            this.followPath();

            const gridPos = {
                x: Math.round(this.x / 32),
                y: Math.round(this.y / 32)
            }

            switch (this.direction) {
                case
                    Direction.UP,
                    Direction.DOWN:

                    this.x = gridPos.x * 32;
                    break;
                case
                    Direction.RIGHT,
                    Direction.LEFT:

                    this.y = gridPos.y * 32;
                    break;
            }
        } else {
            if (this.isScared === true) {
                if (this.timer % (10 * 1.6) === 0 || this.hasHitWall === true)
                    this.findPossibleMoves();
            } else
                if (this.timer % 10 === 0 || this.hasHitWall === true)
                    this.findPossibleMoves();
        }

        switch (this.direction) {
            case Direction.UP: this.y -= this.movementSpeed; break;
            case Direction.RIGHT: this.x += this.movementSpeed; break;
            case Direction.DOWN: this.y += this.movementSpeed; break;
            case Direction.LEFT: this.x -= this.movementSpeed; break;
        }

        this.timer++;
    }

    followPath() {
        const previousDirection = this.direction;

        let gridPos = {
            x: Math.round(this.x / 32),
            y: Math.round(this.y / 32)
        };
        let neighnoringCells = [];
        if (this.path[gridPos.y - 1][gridPos.x] !== -1) neighnoringCells.push({
            direction: Direction.UP,
            value: this.path[gridPos.y - 1][gridPos.x],
            cellPosition: {
                x: gridPos.x,
                y: gridPos.y - 1
            }
        });
        if (this.path[gridPos.y][gridPos.x + 1] !== -1) neighnoringCells.push({
            direction: Direction.RIGHT,
            value: this.path[gridPos.y][gridPos.x + 1],
            cellPosition: {
                x: gridPos.x + 1,
                y: gridPos.y
            }
        });
        if (this.path[gridPos.y + 1][gridPos.x] !== -1) neighnoringCells.push({
            direction: Direction.DOWN,
            value: this.path[gridPos.y + 1][gridPos.x],
            cellPosition: {
                x: gridPos.x,
                y: gridPos.y + 1
            }
        });
        if (this.path[gridPos.y][gridPos.x - 1] !== -1) neighnoringCells.push({
            direction: Direction.LEFT,
            value: this.path[gridPos.y][gridPos.x - 1],
            cellPosition: {
                x: gridPos.x - 1,
                y: gridPos.y
            }
        });

        if (this.isHunting === true) {
            neighnoringCells.sort((a, b) => a.value - b.value);
            this.direction = neighnoringCells[0].direction
        } else if (this.isScared === true) {
            neighnoringCells.sort((a, b) => b.value - a.value);

            if (neighnoringCells[neighnoringCells.length - 1].value <= 10)
                this.direction = neighnoringCells[0].direction
            else {
                this.path = null;
                this.isFarFromPlayer = true
            }
        }
        switch (previousDirection) {
            case Direction.UP, Direction.DOWN:
                this.x = gridPos.x * 32;
                break;
            case Direction.RIGHT:
                this.y = gridPos.y * 32;
                switch (this.direction) {
                    case Direction.UP:
                        this.x = Math.floor(this.x / 32) * 32 + 32
                        break;
                }
                break;
            case Direction.LEFT:
                switch (this.direction) {
                    case Direction.UP:
                        this.x -= 14
                        break;
                }
                break;
        }
    }

    findPossibleMoves() {
        const gridPos = [Math.round(this.x / 32), Math.round(this.y / 32)];
        let possibleMoves = [];

        const previousDirection = this.direction;

        if (this.grid[gridPos[1]][gridPos[0] - 1] !== 1) possibleMoves.push(Direction.LEFT);
        if (this.grid[gridPos[1]][gridPos[0] + 1] !== 1) possibleMoves.push(Direction.RIGHT);


        if (Math.floor(this.y / 32 - 1) !== -1)
            if (this.grid[gridPos[1] - 1][gridPos[0]] === 0) possibleMoves.push(Direction.UP);
        if (this.grid[gridPos[1] + 1][gridPos[0]] === 0) possibleMoves.push(Direction.DOWN);


        if (this.direction === Direction.UP) possibleMoves.splice(possibleMoves.indexOf(Direction.DOWN), 1);
        else if (this.direction === Direction.RIGHT) possibleMoves.splice(possibleMoves.indexOf(Direction.LEFT), 1);
        else if (this.direction === Direction.DOWN) possibleMoves.splice(possibleMoves.indexOf(Direction.UP), 1);
        else if (this.direction === Direction.LEFT) possibleMoves.splice(possibleMoves.indexOf(Direction.RIGHT), 1);

        if (possibleMoves.includes(this.direction) && possibleMoves.length === 1) return;

        if (possibleMoves.length > 1) {
            this.direction = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else if (possibleMoves.length === 1) {
            this.direction = possibleMoves[0];
        } else {
            return;
        }

        switch (this.direction) {
            case Direction.UP:
                if (this.isScared === true)
                    this.y = gridPos[1] * 32 + 5;
                else this.y = gridPos[1] * 32;
                switch (previousDirection) {
                    case Direction.RIGHT: this.x = gridPos[0] * 32; break;
                    case Direction.LEFT: this.x = gridPos[0] * 32; break;
                }
                break;
            case Direction.RIGHT:
                this.x = gridPos[0] * 32;

                switch (previousDirection) {
                    case Direction.UP: this.y = gridPos[1] * 32; break;
                    case Direction.DOWN: this.y = gridPos[1] * 32; break;
                }
                break;
            case Direction.DOWN:
                this.x = gridPos[0] * 32;
                break;
            case Direction.LEFT:
                this.x = gridPos[0] * 32;
                this.y = gridPos[1] * 32;
                break;
        }
    }

    isCollidingWithWall() {
        let nextCells = isCNextCellAWall({ x: this.x, y: this.y }, this.direction)

        let ghostCoords = [this.x / 32, this.y / 32];

        if (nextCells === 1) {
            if (this.direction === Direction.UP && ghostCoords[1] === Math.floor(ghostCoords[1])) {
                this.movementSpeed = 0;
                this.hasHitWall = true;
                this.direction = null;
            } else if (this.direction === Direction.RIGHT && ghostCoords[0] === Math.floor(ghostCoords[0])) {
                this.movementSpeed = 0;
                this.hasHitWall = true;
                this.direction = null;
            } else if (this.direction === Direction.DOWN) {
                this.movementSpeed = 0;
                this.hasHitWall = true;
                this.direction = null;
            } else if (this.direction === Direction.LEFT && ghostCoords[0] === Math.floor(ghostCoords[0])) {
                this.movementSpeed = 0;
                this.hasHitWall = true;
                this.direction = null;
            }
        } else {

            if (this.isScared === true) this.movementSpeed = 1.5 * this.movementSpeedMultiplier;
            else this.movementSpeed = 2.5 * this.movementSpeedMultiplier;
            this.hasHitWall = false;
        }

        const isGlitchingThrough = checkIfGlitchingThroughWall({ x: this.x / 32, y: this.y / 32 }, this.direction);

        if (isGlitchingThrough === null) return

        this.x = isGlitchingThrough.x;
        this.y = isGlitchingThrough.y;
        this.movementSpeed = isGlitchingThrough.movementSpeed;
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
        this.pills = [];
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

                if (this.grid[y][x] === 2) {
                    this.pills.push(new Pill(x * 32, y * 32));
                }
            }
        }
    }

    // Render the maze walls based on the walls array
    render(context) {
        for (let i = 0; i < this.walls.length; i++)
            context.drawImage(this.walls[i].texture, this.walls[i].x, this.walls[i].y, this.walls[i].size, this.walls[i].size);

        for (let i = 0; i < this.pills.length; i++)
            this.pills[i].render(context);
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 32

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
        this.size = 32;

        this.texture = new Image();
        this.texture.src = "../assets/images/pill.png";

        this.animationTick = 0;
        this.animationIndex = 0;
        this.animationSpeed = 15;
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

            if (this.animationIndex >= 7) {
                this.animationIndex = 0;
            }
        }
    }
}