const Direction = Object.freeze({
    UP: 'UP',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    LEFT: 'LEFT'
});

const Grid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 7, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 7, 7, 7, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 7, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

const GhostImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image()
]

GhostImages[0].src = '../assets/images/blinky.png';
GhostImages[1].src = '../assets/images/pinky.png';
GhostImages[2].src = '../assets/images/kinky.png';
GhostImages[3].src = '../assets/images/clyde.png';
GhostImages[4].src = '../assets/images/funky.png';
GhostImages[5].src = '../assets/images/ghostScared.png';

const isCNextCellAWall = (entityCoords, direction) => {
    let nextCells = null;

        /*
            Checks if a cell adjacent to the entity ( in the direction the entity is moving in ) is a wall
            If the cell is a wall, then the entity will stop moving and the entity's position will be set to the edge of the wall
            And hasHitWall will be set to true to stop the entity from updating the animation and to draw the correct sprite based on the direction the entity was lastly moving in
            Also checks if the entity is about to glitch through a wall and if so, stop the entity from moving and set the entity's position to the edge of the wall
        */
        switch (direction) {
            case Direction.UP:
                // Checks if the cell above the entity is outside of the playeable area; if so, set nextCells to 1
                if (Math.floor(entityCoords.y / 32) - 1 !== -1)
                    nextCells = Grid[Math.floor(entityCoords.y / 32) - 1][Math.floor(entityCoords.x / 32)];
                else nextCells = 1;
                break;
            case Direction.RIGHT:
                nextCells = Grid[Math.floor(entityCoords.y / 32)][Math.floor(entityCoords.x / 32) + 1];
                break;
            case Direction.DOWN:
                nextCells = Grid[Math.floor(entityCoords.y / 32) + 1][Math.floor(entityCoords.x / 32)];
                break;
            case Direction.LEFT:
                nextCells = Grid[Math.floor(entityCoords.y / 32)][Math.floor(entityCoords.x / 32) - 1];
                break;
        }

        return nextCells;
}

const checkIfGlitchingThroughWall = (entityCoords, direction) => {
    if (Grid[Math.round(entityCoords.y)][Math.round(entityCoords.x)] === 1) {
        switch (direction) {
            case Direction.UP:
                if (Grid[Math.round(entityCoords.y)][Math.round(entityCoords.x)] === 1) {
                    const x = Math.round(entityCoords.x) * 32;
                    const y = Math.round(entityCoords.y + 1) * 32;
                    return {x: x, y: y, movementSpeed: 0}
                }
                break;
            case Direction.RIGHT:
                if (Grid[Math.round(entityCoords.y)][Math.round(entityCoords.x)] === 1) {
                    const x = Math.round(entityCoords.x - 1) * 32;
                    const y = Math.round(entityCoords.y) * 32;
                    return {x: x, y: y, movementSpeed: 0}
                }
                break;
            case Direction.DOWN:
                if (Grid[Math.round(entityCoords.y)][Math.round(entityCoords.x)] === 1) {
                    const x = Math.round(entityCoords.x) * 32;
                    const y = Math.round(entityCoords.y - 1) * 32;
                    return {x: x, y: y, movementSpeed: 0}
                }
                break;
            case Direction.LEFT:
                if (Grid[Math.round(entityCoords.y)][Math.round(entityCoords.x)] === 1) {
                    const x = Math.round(entityCoords.x + 1) * 32;
                    const y = Math.round(entityCoords.y) * 32;
                    return {x: x, y: y, movementSpeed: 0}
                }
                break;
        }
    }

    return null;
}