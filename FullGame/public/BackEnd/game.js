class Game{

    constructor(width,height,count){
        this.obstacleCount = count;
        this.width = width;
        this.height = height;

        this.tile_size = 32;

        this.open = 1;
        this.closed = 0;

        this.maze = [];

        this.last_entrance = null;
        this.last_exit = null;

        this.obstacle = [];

        this.canvas = document.getElementById("maze");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = width * this.tile_size;
        this.canvas.height = height * this.tile_size;

        this.wallImage = new Image();
        this.wallImage.src = "/BackEnd/tiles/closed.png";

        this.openImage = new Image();
        this.openImage.src = "/BackEnd/tiles/open.png";
    }



    create_maze(){

        this.maze = this.create_2D_array(this.width,this.height,this.closed);

        let start_x = this.set_to_odd(this.random_int(1,this.width-1));
        let start_y = this.set_to_odd(this.random_int(1,this.height-1));

        this.dig_around(start_x,start_y);

        this.create_path();

        this.place_obstacle(this.obstacleCount);
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
        return x>=0 && y>=0 && x<this.width && y<this.height;
    }



    create_path(){

        let entrance,exit;

        if(this.random_flip()){

            entrance = {
                x:0,
                y:this.set_to_odd(this.random_int(1,this.height-1))
            };

            exit = {
                x:this.width-1,
                y:this.set_to_odd(this.random_int(1,this.height-1))
            };

        }else{

            entrance = {
                x:this.set_to_odd(this.random_int(1,this.width-1)),
                y:0
            };

            exit = {
                x:this.set_to_odd(this.random_int(1,this.width-1)),
                y:this.height-1
            };
        }

        this.maze[entrance.y][entrance.x] = this.open;
        this.maze[exit.y][exit.x] = this.open;

        this.last_entrance = entrance;
        this.last_exit = exit;
    }



    draw_maze(){

        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        for(let y=0;y<this.maze.length;y++){
            for(let x=0;x<this.maze[y].length;x++){

                let tile = this.maze[y][x];
                let img = tile === this.closed ? this.wallImage : this.openImage;

                this.ctx.drawImage(
                    img,
                    x*this.tile_size,
                    y*this.tile_size,
                    this.tile_size,
                    this.tile_size
                );
            }
        }
    }


    place_obstacle(count){

        let possible=[];

        for(let y=0;y<this.height;y++){
            for(let x=0;x<this.width;x++){

                if(this.maze[y][x]===this.open){

                    if(this.last_entrance &&
                       x===this.last_entrance.x &&
                       y===this.last_entrance.y) continue;

                    if(this.last_exit &&
                       x===this.last_exit.x &&
                       y===this.last_exit.y) continue;

                    possible.push({x,y});
                }
            }
        }

        possible = this.shuffle_array(possible);

        for(let i=0;i<count && i<possible.length;i++){

            this.obstacle.push({
                x:possible[i].x,
                y:possible[i].y,
                type:"banana_question"
            });
        }
    }


    random_int(min,max){
        return Math.floor(Math.random()*(max-min))+min;
    }

    random_flip(){
        return Math.random()<0.5;
    }

    set_to_odd(n){
        return (n%2===1)?n:n+1;
    }

    shuffle_array(arr){

        let copy=[...arr];

        for(let i=0;i<copy.length;i++){

            let r = this.random_int(0,copy.length);

            let temp = copy[i];
            copy[i]=copy[r];
            copy[r]=temp;
        }

        return copy;
    }

    create_2D_array(width,height,fill){

        let arr=[];

        for(let y=0;y<height;y++){

            let row=[];

            for(let x=0;x<width;x++){
                row.push(fill);
            }

            arr.push(row);
        }

        return arr;
    }
    preloadImages(){
        return Promise.all([
            new Promise(res => this.wallImage.onload = res),
            new Promise(res => this.openImage.onload = res)
        ]);
    }
}