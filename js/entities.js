const Direction = await import("./utils.js").then(module => module.Direction);


class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.movementSpeed = 4;
        this.hasHitWall = false;
        this.direction = Direction.LEFT;

        this.spritesSrc = new Image();
        this.spritesSrc.src = `../assets/PacMan-ezgif.com-resize.png`
    }

    update() {
        if (this.hasHitWall == false) {
            switch (this.direction) {
                case Direction.UP:
                    this.y -= this.movementSpeed;
                    break;

                case Direction.RIGHT:
                    this.x += this.movementSpeed;
                    break;

                case Direction.DOWN:
                    this.y += this.movementSpeed;
                    break;

                case Direction.LEFT:
                    this.x -= this.movementSpeed;
                    break;
            }
        }
    }

    render(context) {
        context.drawImage(this.spritesSrc, 0, 0, 32, 32, this.x, this.y, 32, 32);
    }
}

class Ghost {
    construcotr(x, y, color) {
        this.x = x;
        this.y = y;
        this.direction = Direction.LEFT;

        this.spritesSrc = `../assets/${color}Ghost.png`;
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.spritesSrc = "../assets/Coin.png";
    }
}

class Pill {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.spritesSrc = "../assets/Pill.png";
    }
}

export { Player, Ghost, Coin, Pill };