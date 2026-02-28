movePlayer = (direction, graph) => {

    let [level, cell] = this.index2DFrom1D(this.playerIndex);
    let target = null;

    if (direction === "left") {
        target = this.leftIndex1D(level, cell);
    }

    if (direction === "right") {
        target = this.rightIndex1D(level, cell);
    }

    if (direction === "in" && level > 0) {
        target = this.parentIndex1D(level, cell);
    }

    if (direction === "out" && level < this.num_levels - 1) {

        if (this.num_cells_at_level[level] <
            this.num_cells_at_level[level + 1]) {

            target = this.index1DFrom2D(level + 1, 2 * cell);

        } else {
            target = this.index1DFrom2D(level + 1, cell);
        }
    }

    // Only move if there is a connection
    if (target !== null &&
        graph[this.playerIndex].includes(target)) {

        this.playerIndex = target;
    }
};

document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowLeft")
        maze.movePlayer("left", tree);

    if (e.key === "ArrowRight")
        maze.movePlayer("right", tree);

    if (e.key === "ArrowUp")
        maze.movePlayer("out", tree);

    if (e.key === "ArrowDown")
        maze.movePlayer("in", tree);

    drawEverything();
});

drawPlayer = () => {

    let [level, cell] = this.index2DFrom1D(this.playerIndex);

    let radius = level * this.line_length +
                 this.line_length / 2;

    let arcAngle = (2 * Math.PI) /
                   this.num_cells_at_level[level];

    let angle = cell * arcAngle + arcAngle / 2;

    let x = this.centerX + radius * Math.cos(angle);
    let y = this.centerY + radius * Math.sin(angle);

    this.ctx.beginPath();
    this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
};

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maze.drawMaze(tree);
    maze.drawPlayer();
}

if (level === maze.num_levels - 1 &&
    playerReachedExitCell) {
    alert("You escaped!");
}