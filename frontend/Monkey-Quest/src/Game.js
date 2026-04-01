import Maze from "./Maze.js";
import Obstacle from "./Obstacle.js";
import Player from "./Player.js";

class Game {
    constructor(canvasId,rows,cols,difficulty,user){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.difficulty = difficulty;
        this.mazeObj = new Maze(rows,cols);
        this.player = null;
        this.obstacle = null;
        this.user = user;
    }

    async start(){
        await this.mazeObj.loadImages();
        let maze =this.mazeObj.create_maze()
        //debug
        console.log(this.mazeObj.entrance)
        console.log(this.mazeObj.exit)

        this.canvas.width = this.mazeObj.width*this.mazeObj.tileSize;
        this.canvas.height = this.mazeObj.height*this.mazeObj.tileSize;

        this.obstacle = new Obstacle(this.mazeObj);
        this.player = new Player(this, this.mazeObj.entrance.x, this.mazeObj.entrance.y);
        

        this.obstacle.loadObstacleAnimations();

        this.obstacle.find_path(maze,this.mazeObj.entrance,this.mazeObj.exit);
        this.obstacle.generateObstacles(this.difficulty);

        this.loop();
    }

    handleWin(){
        if(this.user.level_up()){
            const overlay = document.createElement("div");
            overlay.classList.add("LevelUP_overlay");

            overlay.innerHTML = `
                <img src="${this.user.levelsBoard[this.user.level].profile}" alt="profile" class="profile-mon">
                <h1>Level Up!</h1>
                <h2>Score: ${this.user.coins}</h2>
                <button id="closeLevelUp">OK</button>
            `;

            document.body.appendChild(overlay);

            document.getElementById("closeLevelUp").addEventListener("click", () => {
                overlay.remove(); 
            });
        }else{
            document.getElementById("question").innerHTML = "Keep playing!";
        }
   
        this.user.player_init_level();
    }
    handleInput(event){
        const result = this.player.handleKey(event);

        if(!result) return;

        if(result.isOb){
            this.handleObstacle(result);
        }
    }
    handleObstacle(obstacleData){
        fetch("https://marcconrad.com/uob/banana/api.php?out=json")
        .then(res => res.json())
        .then(data => {

            const question = data.question;
            const answer = Number(data.solution);

            const questionEl = document.getElementById("question");
            questionEl.innerHTML = `<img src="${question}" alt="Banana Question">`;

            this.currentAnswer = answer;
            this.currentObstacle = obstacleData;
        });
    }
    submitAnswer(userAnswer){
        if(userAnswer === this.currentAnswer){

            this.obstacle.removeObstacle(
                this.currentObstacle.locX,
                this.currentObstacle.locY
            );

            document.getElementById("question").innerHTML = "Correct!";
            return true;

        } else {
            document.getElementById("question").innerHTML = "Incorrect!";
            return false;
        }
    }

    loop = () => {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.mazeObj.draw_maze(this.ctx);
        if(this.player) this.player.draw();
        this.obstacle.draw_obstacle(this.ctx);

        requestAnimationFrame(this.loop);
    }
}

export default Game;

