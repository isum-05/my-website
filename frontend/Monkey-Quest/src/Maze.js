import closedImg from "./assets/tiles/closed.png";
import openImg from "./assets/tiles/open.png";

class Maze{
    constructor(w,h){
        this.maze = [];
        this.width = w;
        this.height = h;

        this.open = 1;
        this.closed = 0;

        this.entrance = null;
        this.exit = null;
        this.tileSize =32;

        this.wallImage = new Image();
        this.wallImage.src = closedImg;

        this.openImage = new Image();
        this.openImage.src = openImg;
    }
    
    create_maze(){
        this.maze = this.create_2D_array(this.width,this.height,this.closed);
        
        let start_x = this.random_int(1,this.width-1);
        let start_y = this.random_int(1,this.height-1);

        start_x = this.set_to_odd(start_x);
        start_y = this.set_to_odd(start_y);

        this.dig_around(start_x,start_y);

        this.create_path();
        
        return this.maze;
    }
    dig_around(x,y){

        this.maze[y][x] = this.open;

        let neighbors = [
            {x:x-2,y:y},
            {x:x+2,y:y},
            {x:x,y:y-2},
            {x:x,y:y+2}
        ];

        neighbors = this.shuffle_array(neighbors);

        neighbors.forEach(n=>{
            this.dig_to(n.x,n.y,x,y);
        });
    }
    dig_to(dest_x,dest_y,from_x,from_y){

        if(!this.is_within_map(dest_x,dest_y)) return;

        let mid_x = (dest_x+from_x)/2;
        let mid_y = (dest_y+from_y)/2;

        let dest = this.maze[dest_y][dest_x];
        let mid = this.maze[mid_y][mid_x];

        if(dest === this.closed && mid === this.closed){

            this.maze[dest_y][dest_x] = this.open;
            this.maze[mid_y][mid_x] = this.open;

            this.dig_around(dest_x,dest_y);
        }
    }
    is_within_map(x,y){
        return x >= 0 && y >= 0 && x < this.maze[0].length && y < this.maze.length;
    }

    create_path(){
        if(this.random_flip()){
            this.entrance = {
                x:0,
                y:this.random_int(1,this.maze.length-1)
            }
            this.exit = {
                x:this.maze[0].length-1,
                y:this.random_int(1,this.maze.length-1)
            }
            this.entrance.y = this.set_to_odd(this.entrance.y);
            this.exit.y = this.set_to_odd(this.exit.y);
        }else{
            this.entrance = {
                    x:this.random_int(1,this.maze[0].length-1),
                    y:0
            }
            this.exit = {
                x:this.random_int(1,this.maze[0].length-1),
                y:this.maze.length-1
            }
            this.entrance.x = this.set_to_odd(this.entrance.x);
            this.exit.x = this.set_to_odd(this.exit.x);
        }
        this.maze[this.entrance.y][this.entrance.x] = this.open;
        this.maze[this.exit.y][this.exit.x] = this.open;
    }


    //helpers//
    create_2D_array(width, height,fill_value){

        let array = [];

        for(let i = 0; i < height; i++){
            let row = [];
            for(let j = 0; j < width; j++){
                row.push(fill_value);
            }
            array.push(row);
        }

        return array;
    }
    //fisher-yates shuffle
    shuffle_array(array){
        let copy = [];
        for(let i = 0;i<array.length;i++){
            copy.push(array[i]);
        
        }

        for(let i =0;i<copy.length;i++){
            let random_index = this.random_int(0,copy.length-1);

            let temp = copy[random_index];
            copy[random_index] = copy[i];
            copy[i] = temp;
        }
        return copy;    
    }
    random_int(min,max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
    random_flip(){
        return Math.random() < 0.5;
    }
    set_to_odd(n){
        return (n % 2 === 1) ? n : n+1;
    }
    isWall(x,y){ return this.maze[y][x] === this.closed; }

    //draw maze wall into canvas 2d ctx should be passed as argument to draw
    draw_maze(ctx){
        ctx.clearRect(0,0,(this.width * this.tileSize),(this.height*this.tileSize));
        for(let y=0; y<this.maze.length; y++){
            for(let x=0; x<this.maze[y].length; x++){

                    let tile = this.maze[y][x];
                    let img;

                    if(tile === this.closed){
                        img = this.wallImage;
                    }
                    else{
                        img = this.openImage;
                    }
                    ctx.drawImage(
                        img,
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                }
        }
    }
    //ai generated 
    loadImages(){
        return Promise.all([
            new Promise((resolve) => {
                this.wallImage.onload = resolve;
            }),
            new Promise((resolve) => {
                this.openImage.onload = resolve;
            })
        ]);
    }

}


export default Maze;