class PathFinder {
    constructor(start, goal, grid) {
        this.grid = grid;
        this.path = this.bfs(start, goal, grid);
    }

    bfs(start, goal, grid) {
        const list = [];
        for (let y = 0; y < grid.length; y++) {
            list.push([]);
            for (let x = 0; x < grid[0].length; x++)
                list[y].push(-1);
        }

        list[goal.y][goal.x] = 0;
        const queue = [];
        queue.push(goal);

        while (queue.length > 0) {
            const current = queue.shift();
            const neighbors = this.findNeighbors(current);

            for (const neighbor of neighbors) {
                if (list[neighbor.y][neighbor.x] === -1) {
                    list[neighbor.y][neighbor.x] = list[current.y][current.x] + 1;
                    queue.push(neighbor);
                }
            }
        }
        return list;
    }

    findNeighbors(node) {
        const neighbors = [];
        const { x, y } = node;
        const grid = this.grid;

        if (y > 0 && grid[y - 1][x] !== 1) {
            neighbors.push({ x: x, y: y - 1 });
        }

        if (y < grid.length - 1 && grid[y + 1][x] !== 1) {
            neighbors.push({ x: x, y: y + 1 });
        }

        if (x > 0 && grid[y][x - 1] !== 1) {
            neighbors.push({ x: x - 1, y: y });
        }

        if (x < grid[0].length - 1 && grid[y][x + 1] !== 1) {
            neighbors.push({ x: x + 1, y: y });
        }

        return neighbors;
    }
}

onmessage = (event) => {
    const { start, goal, grid } = event.data;

    const pathFinder = new PathFinder(start, goal, grid);
    const path = pathFinder.path;

    postMessage(path);
};