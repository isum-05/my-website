import questionIMG from "./assets/SpriteSheet/spriteSheet_2_mini.png";
class Obstacle{

    constructor(ctx){
        this.game = ctx;
        this.path = [];
        this.obstacles = [];
        this.frame = 0;
        this.stagger = 10;
        this.spriteWidth = 26;
        this.spriteHeight = 27;
        this.tile_size = 32;
        this.questionImage = new Image();
        this.questionImage.src = questionIMG;
        this.questionAnimations = {};
    }

    find_path(maze_array, start, end){

        const ROW = maze_array.length;
        const COL = maze_array[0].length;

        const visited = Array.from({length: ROW}, () => Array(COL).fill(false));
        const parent = {};

        const dRow = [-1,0,1,0];
        const dCol = [0,1,0,-1];

        function isValid(row, col){
            return row >= 0 && col >= 0 &&
                row < ROW && col < COL &&
                !visited[row][col] &&
                maze_array[row][col] === 1;
        }

        let queue = [];
        queue.push(start);
        visited[start.y][start.x] = true;

        while(queue.length){

            let current = queue.shift();

            if(current.x === end.x && current.y === end.y){
                break;
            }

            for(let i=0;i<4;i++){
                let newRow = current.y + dRow[i];
                let newCol = current.x + dCol[i];

                if(isValid(newRow,newCol)){

                    queue.push({x:newCol, y:newRow});
                    visited[newRow][newCol] = true;

                    parent[`${newCol},${newRow}`] = current;
                }
            }
        }
        if (!visited[end.y][end.x]) {
            this.path = [];
            return [];
        }
        this.path = [];
        let curr = end;

        while(curr){
            this.path.push(curr);
            curr = parent[`${curr.x},${curr.y}`];
        }

    return this.path.reverse();
    }
    
    loadObstacleAnimations(){

        const states = [
            {name:"banana_question",frames:8}
        ];

        states.forEach((state,index)=>{

            let frames = {loc:[]};

            for(let j=0;j<state.frames;j++){

                let positionX = j * (this.spriteWidth + 1.97);
                let positionY = index * this.spriteHeight;

                frames.loc.push({x:positionX,y:positionY});
            }

            this.questionAnimations[state.name] = frames;
        });
    }
    //ai generated
    generateObstacles(count) {
        if (!this.path || this.path.length <= 2) {
            this.obstacles = [];
            return;
        }

        // remove start & end
        const safePath = this.path.slice(1, -1);

        // shuffle
        const shuffled = [...safePath].sort(() => Math.random() - 0.5);

        // take count (unique automatically)
        this.obstacles = shuffled.slice(0, count);
    }


    draw_obstacle(ctx) {
        if (!this.obstacles || this.obstacles.length === 0) return;

        let animation = this.questionAnimations["banana_question"];
        if (!animation) return;

        this.frame++;

        for (let obs of this.obstacles) {
            let frameIndex =
                Math.floor(this.frame / this.stagger) %
                animation.loc.length;

            let frameX = animation.loc[frameIndex].x;
            let frameY = animation.loc[frameIndex].y;

            ctx.drawImage(
                this.questionImage,
                frameX,
                frameY,
                this.spriteWidth,
                this.spriteHeight,
                obs.x * this.tile_size,
                obs.y * this.tile_size,
                this.tile_size,
                this.tile_size
            );
        }
    }



    //helper

    getObstacleAt(x, y) {
        return this.obstacles.find(o => o.x === x && o.y === y);
    }

    removeObstacle(x, y) {
        this.obstacles = this.obstacles.filter(
            o => !(o.x === x && o.y === y)
        );
    }
}

export default Obstacle;