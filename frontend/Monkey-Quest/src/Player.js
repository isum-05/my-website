import playerS from "./assets/SpriteSheet/spriteSheet.png";

class Player {
    constructor(game, startX, startY){
        this.game = game;
        this.ctx = game.ctx;

        this.x = startX;
        this.y = startY;

        this.direction = "down";
        this.isMoving = false;

        this.tileSize = game.mazeObj.tileSize;

        this.spriteWidth = 64;
        this.spriteHeight = 64;

        this.image = new Image();
        this.image.src = playerS;

        this.frame = 0;
        this.stagger = 7;

        this.animations = {};
        this.loadAnimations();

        document.addEventListener("keydown", this.handleKey.bind(this));
    }

    loadAnimations(){
        const states = [
            {name:"back",frames:8},
            {name:"back_left",frames:6},
            {name:"side_left",frames:10},
            {name:"front_left",frames:8},
            {name:"front",frames:10},
            {name:"front_right",frames:8},
            {name:"side_right",frames:12},
            {name:"back_right",frames:6},
            {name:"jump",frames:15},
            {name:"roll",frames:6},
        ];
        states.forEach((state,index)=>{
            let frames = {loc:[]};

            for(let j=0;j<state.frames;j++){

                let positionX = j * this.spriteWidth;
                let positionY = index * this.spriteHeight;

                frames.loc.push({x:positionX,y:positionY});
            }
            this.animations[state.name] = frames;
        });
    }

    draw(){
        let posX = this.x * this.tileSize;
        let posY = this.y * this.tileSize;
        let animation = this.animations["front"];
        if(this.direction === "up") animation = this.animations["back"];
        if(this.direction === "down") animation = this.animations["front"];
        if(this.direction === "left") animation = this.animations["side_left"];
        if(this.direction === "right") animation = this.animations["side_right"];

        let frameIndex = 0;

        if(this.isMoving){
            frameIndex = Math.floor(this.frame / this.stagger) % animation.loc.length;
            this.frame++;
        }

        let frameX = animation.loc[frameIndex].x;
        let frameY = animation.loc[frameIndex].y;

        this.ctx.drawImage(
            this.image,
            frameX,
            frameY,
            this.spriteWidth,
            this.spriteHeight,
            posX,
            posY,
            this.tileSize,
            this.tileSize
        );
    }

     handleKey(event){

        let newX = this.x;
        let newY = this.y;

        this.isMoving = true;

        if(event.key === "ArrowUp"){
            newY--;
            this.direction = "up";
        }
        else if(event.key === "ArrowDown"){
            newY++;
            this.direction = "down";
        }
        else if(event.key === "ArrowLeft"){
            newX--;
            this.direction = "left";
        }
        else if(event.key === "ArrowRight"){
            newX++;
            this.direction = "right";
        }
        else{
            this.isMoving = false;
            return;
        }

        this.tryMove(newX,newY);
    }

    tryMove(newX,newY){
        const maze = this.game.mazeObj;

        if(newX<0 || newY<0 || newX>=maze.width || newY>=maze.height) return;
        if(maze.isWall(newX,newY)) return;

        this.x = newX;
        this.y = newY;

        if(this.x === maze.exit.x && this.y === maze.exit.y){
            this.game.handleWin();
        }
    }
}

export default Player;