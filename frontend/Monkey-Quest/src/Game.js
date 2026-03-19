import Maze from "./Maze.js";
import Player from "./Player.js";

class Game {
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.mazeObj = new Maze(11,11);
        this.player = null;
    }

    async start(){
        await this.mazeObj.loadImages();
        this.mazeObj.create_maze();

        this.canvas.width = this.mazeObj.width*this.mazeObj.tileSize;
        this.canvas.height = this.mazeObj.height*this.mazeObj.tileSize;

        this.player = new Player(this, this.mazeObj.entrance.x, this.mazeObj.entrance.y);

        this.loop();
    }

    handleWin(){
        alert("You reached the exit!");
    }

    loop = () => {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.mazeObj.draw_maze(this.ctx);
        if(this.player) this.player.draw();

        requestAnimationFrame(this.loop);
    }
}

export default Game;