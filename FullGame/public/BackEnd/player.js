class Player{

    constructor(game){

        this.game = game;

        this.x = game.last_entrance ? game.last_entrance.x : 1;
        this.y = game.last_entrance ? game.last_entrance.y : 1;

        this.direction = "down";
        this.isMoving = false;

        this.tile_size = game.tile_size;


        this.gameFrame = 0;
        this.staggerFrames = 7;

        this.questionFrame = 0;
        this.questionStagger = 10;


        this.spriteWidth = {
            player:64,
            question:26
        };

        this.spriteHeight = {
            player:64,
            question:27
        };


        this.playerImage = new Image();
        this.playerImage.src = "/BackEnd/SpriteSheet/spriteSheet.png";

        this.questionImage = new Image();
        this.questionImage.src = "/BackEnd/SpriteSheet/spriteSheet_2_mini.png";


        this.spriteAnimations = {};
        this.questionAnimations = {};

        this.loadPlayerAnimations();
        this.loadQuestionAnimations();

        document.addEventListener("keydown", this.handleKey.bind(this));
    }

    loadPlayerAnimations(){

        const animationStates = [
            {name:"back",frames:8},
            {name:"back_left",frames:6},
            {name:"side_left",frames:10},
            {name:"front_left",frames:8},
            {name:"front",frames:11},
            {name:"front_right",frames:8},
            {name:"side_right",frames:12},
            {name:"back_right",frames:6},
            {name:"jump",frames:15},
            {name:"roll",frames:6},
        ];

        animationStates.forEach((state,index)=>{

            let frames = {loc:[]};

            for(let j=0;j<state.frames;j++){

                let positionX = j * this.spriteWidth.player;
                let positionY = index * this.spriteHeight.player;

                frames.loc.push({x:positionX,y:positionY});
            }

            this.spriteAnimations[state.name] = frames;
        });
    }


    loadQuestionAnimations(){

        const states = [
            {name:"banana_question",frames:8}
        ];

        states.forEach((state,index)=>{

            let frames = {loc:[]};

            for(let j=0;j<state.frames;j++){

                let positionX = j * (this.spriteWidth.question + 1.97);
                let positionY = index * this.spriteHeight.question;

                frames.loc.push({x:positionX,y:positionY});
            }

            this.questionAnimations[state.name] = frames;
        });
    }


    draw(){

        const ctx = this.game.ctx;

        let posX = this.x * this.tile_size;
        let posY = this.y * this.tile_size;

        let animation = this.spriteAnimations["front"];

        if(this.direction === "up") animation = this.spriteAnimations["back"];
        if(this.direction === "down") animation = this.spriteAnimations["front"];
        if(this.direction === "left") animation = this.spriteAnimations["side_left"];
        if(this.direction === "right") animation = this.spriteAnimations["side_right"];

        let frameIndex = 0;

        if(this.isMoving){
            frameIndex = Math.floor(this.gameFrame / this.staggerFrames) % animation.loc.length;
            this.gameFrame++;
        }

        let frameX = animation.loc[frameIndex].x;
        let frameY = animation.loc[frameIndex].y;

        ctx.drawImage(
            this.playerImage,
            frameX,
            frameY,
            this.spriteWidth.player,
            this.spriteHeight.player,
            posX,
            posY,
            this.tile_size,
            this.tile_size
        );
    }

    drawObstacles(){

        const ctx = this.game.ctx;
        const obstacles = this.game.obstacle;

        for(let obs of obstacles){

            let animation = this.questionAnimations["banana_question"];

            let frameIndex = Math.floor(this.questionFrame / this.questionStagger) % animation.loc.length;

            let frameX = animation.loc[frameIndex].x;
            let frameY = animation.loc[frameIndex].y;

            ctx.drawImage(
                this.questionImage,
                frameX,
                frameY,
                this.spriteWidth.question,
                this.spriteHeight.question,
                obs.x * this.tile_size,
                obs.y * this.tile_size,
                this.tile_size,
                this.tile_size
            );
        }

        this.questionFrame++;
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

        let maze = this.game.maze;

        if(newX < 0 || newY < 0 || newX >= this.game.width || newY >= this.game.height){
            this.isMoving = false;
            return;
        }

        if(maze[newY][newX] === this.game.closed){
            this.isMoving = false;
            return;
        }

        let obstacle = this.getObstacleAt(newX,newY);

        if(obstacle){
            this.askBananaQuestion(newX,newY);
            return;
        }

        this.x = newX;
        this.y = newY;

        this.checkWin();
    }

    getObstacleAt(x,y){

        return this.game.obstacle.find(o => o.x === x && o.y === y);
    }

    removeObstacle(x,y){

        this.game.obstacle =
            this.game.obstacle.filter(o => !(o.x === x && o.y === y));
    }
    
    askBananaQuestion(newX,newY){

        this.isMoving = false;

        fetch("https://marcconrad.com/uob/banana/api.php?out=json")
        .then(res=>res.json())
        .then(data=>{

            const question = data.question;
            const answer = Number(data.solution);


           const questionEl = document.getElementById("question");
           questionEl.innerHTML = `<img src="${question}" alt="Banana Question">`;


            document.getElementById("banana_question_form").onsubmit = (e)=>{

                e.preventDefault();

                let user_answer =
                Math.round(Number(document.getElementById("msg").value));

                if(user_answer === answer){

                    this.removeObstacle(newX,newY);
                    user.update_coins(500);
                    updateDashBoardDisplay();
                    user.save();
                    this.x = newX;
                    this.y = newY;
                    questionEl.innerHTML = `Correct!`;

                }else{
                    user.failed_attempts(500);
                    updateDashBoardDisplay();
                    user.save();

                   questionEl.innerHTML = `Incorrect!`;

                    setTimeout(()=>{
                        this.x = this.game.last_entrance.x;
                        this.y = this.game.last_entrance.y;
                    },20);
                }
                document.getElementById("msg").value = ``;

            };
        });
    }
    isAtExit() {
    return this.x === this.game.last_exit.x && this.y === this.game.last_exit.y;
    }

    checkWin() {
        if (this.isAtExit()) {
            const leveledUp = user.level_up();
            if (leveledUp) {
                showLevelUpOverlay();
                updateDashBoardDisplay();
            }
            user.playerInit_level();
            user.save();
        }
    }
}