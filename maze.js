class CircularMaze {

    constructor(n, r, ctx, centerX, centerY) {
        this.num_levels = n;
        this.line_length = r;
        this.ctx = ctx;
        this.centerX = centerX;
        this.centerY = centerY;

        this.num_cells_at_level = this.cellCountByLevel();
        this.total_cells = this.num_cells_at_level.reduce((a, b) => a + b, 0);
    }

    cellCountByLevel() {
        let cells = [1];

        for (let level = 1; level < this.num_levels; level++) {
            cells.push(
                Math.pow(2, Math.floor(Math.log2(level + 1)) + 3)
            );
        }
        return cells;
    }

    index1DFrom2D(level, cell) {
        if (level >= this.num_levels)
            throw "Level exceeds maze levels";

        let idx = 0;
        for (let i = 0; i < level; i++)
            idx += this.num_cells_at_level[i];

        return idx + cell;
    }

    index2DFrom1D(idx) {
        if (idx >= this.total_cells)
            throw "Index exceeds total cells";

        let level = 0;

        while (idx - this.num_cells_at_level[level] >= 0) {
            idx -= this.num_cells_at_level[level];
            level++;
        }

        return [level, idx];
    }

    parentIndex1D(level, cell) {
        if (level <= 0)
            throw "No parent";

        if (level === 1)
            return 0;

        if (this.num_cells_at_level[level - 1] < this.num_cells_at_level[level])
            return this.index1DFrom2D(level - 1, Math.floor(cell / 2));

        return this.index1DFrom2D(level - 1, cell);
    }

    leftIndex1D(level, cell) {
        if (cell === 0)
            return this.index1DFrom2D(level, this.num_cells_at_level[level] - 1);

        return this.index1DFrom2D(level, cell - 1);
    }

    rightIndex1D(level, cell) {
        if (cell === this.num_cells_at_level[level] - 1)
            return this.index1DFrom2D(level, 0);

        return this.index1DFrom2D(level, cell + 1);
    }

    createDFSTree() {
        let graph = {};
        for (let i = 0; i < this.total_cells; i++)
            graph[i] = [];

        let cell = Math.floor(Math.random() * (this.total_cells - 1)) + 1;

        let visited = new Set([cell]);
        let stack = [cell];

        while (visited.size < this.total_cells) {

            let [level, c] = this.index2DFrom1D(cell);
            let connections = [];

            if (level === 0) {
                for (let i = 1; i <= this.num_cells_at_level[1]; i++)
                    connections.push(i);
            } else {

                connections.push(this.parentIndex1D(level, c));
                connections.push(this.leftIndex1D(level, c));
                connections.push(this.rightIndex1D(level, c));

                if (level <= this.num_levels - 2) {

                    if (this.num_cells_at_level[level] < this.num_cells_at_level[level + 1]) {

                        connections.push(
                            this.index1DFrom2D(level + 1, 2 * c)
                        );
                        connections.push(
                            this.index1DFrom2D(level + 1, 2 * c + 1)
                        );

                    } else {
                        connections.push(
                            this.index1DFrom2D(level + 1, c)
                        );
                    }
                }
            }

            let unvisited = connections.filter(n => !visited.has(n));

            if (unvisited.length > 0) {
                let next = unvisited[Math.floor(Math.random() * unvisited.length)];

                graph[cell].push(next);
                graph[next].push(cell);

                visited.add(next);
                stack.push(next);
                cell = next;
            } else {
                cell = stack.pop();
            }
        }

        return graph;
    }

    drawArc(radius, startAngle, arcAngle) {
        this.ctx.beginPath();
        this.ctx.arc(
            this.centerX,
            this.centerY,
            radius,
            startAngle,
            startAngle + arcAngle
        );
        this.ctx.stroke();
    }

    drawLine(radius, angle) {
        let x1 = this.centerX + radius * Math.cos(angle);
        let y1 = this.centerY + radius * Math.sin(angle);

        let x2 = this.centerX + (radius + this.line_length) * Math.cos(angle);
        let y2 = this.centerY + (radius + this.line_length) * Math.sin(angle);

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawMaze(graph) {
        this.ctx.lineWidth = 2;

        for (let level = 1; level < this.num_levels; level++) {

            let radius = level * this.line_length;
            let arcAngle = (2 * Math.PI) / this.num_cells_at_level[level];

            for (let cell = 0; cell < this.num_cells_at_level[level]; cell++) {

                let cell1D = this.index1DFrom2D(level, cell);
                let parent = this.parentIndex1D(level, cell);
                let left = this.leftIndex1D(level, cell);

                let angle = cell * arcAngle;

                if (!graph[cell1D].includes(left))
                    this.drawLine(radius, angle);

                if (!graph[cell1D].includes(parent))
                    this.drawArc(radius, angle, arcAngle);
            }
        }
                // Draw outer boundary
        let radius = this.num_levels * this.line_length;
        let numCells = this.num_cells_at_level[this.num_cells_at_level.length - 1];
        let arcAngle = (2 * Math.PI) / numCells;

        let skipArc = Math.floor(Math.random() * numCells);

        for (let cell = 0; cell < numCells; cell++) {

            if (cell === skipArc) continue; // leave entrance open

            let startAngle = cell * arcAngle;

            this.ctx.beginPath();
            this.ctx.arc(
                this.centerX,
                this.centerY,
                radius,
                startAngle,
                startAngle + arcAngle
            );
            this.ctx.stroke();
        }
    }
}

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const maze = new CircularMaze(6, 30, ctx, 400, 400);

const tree = maze.createDFSTree();
maze.drawMaze(tree);