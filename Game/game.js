
let last_entrance, last_exit;

let obstacle = [];

const width = 21;
const height = 21;


const tile_size = 32;
const open = 1;
const closed = 0;


//const closed_tile_img = 'tiles/t2.png';
const closed_tile_img = 'tiles/closed.png';
const open_tile_img = 'tiles/open.png';


let maze = [];

const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');

canvas.width = width * tile_size;
canvas.height = height * tile_size;

const wallImage = new Image();
wallImage.src = closed_tile_img;

const openImage = new Image();
openImage.src = open_tile_img;

/*const obstacleImage = new Image();
obstacleImage.src = "tiles/obstacle.png"; // question mark tile*/

function create_maze(){
    maze = create_2D_array(width,height,closed);

    let start_x = random_int(1,width-1);
    let start_y = random_int(1,height-1);

    start_x = set_to_odd(start_x);
    start_y = set_to_odd(start_y);

    dig_around(start_x,start_y);

    create_path();

    //ai generated
    Promise.all([
        new Promise(res => wallImage.onload = res),
        new Promise(res => openImage.onload = res)
    ]).then(() => {
        draw_maze();
        place_obstacle(3);
    });
}
function dig_around(x,y){
    maze[y][x] = open;

    let neighbors = [
        {x:x-2, y:y}, // left
        {x:x+2, y:y}, // right
        {x:x, y:y-2}, // up
        {x:x, y:y+2}  // down
    ];

    neighbors = shuffle_array(neighbors);

    neighbors.forEach(neighbor =>{
        dig_to(neighbor.x, neighbor.y,x,y);
    });
}

function dig_to(dest_x,dest_y,from_x,from_y){
    let mid_x = (dest_x + from_x) / 2;
    let mid_y = (dest_y + from_y) / 2;
    
    if(!is_within_map(dest_x,dest_y)){
        return;
    }
    let dest = maze[dest_y][dest_x];
    let mid = maze[mid_y][mid_x];

    if(dest == closed && mid == closed){
        maze[dest_y][dest_x] = open;
        maze[mid_y][mid_x] = open;

        dig_around(dest_x, dest_y);
    } 
}

function is_within_map(x,y){
    return x >= 0 && y >= 0 && x < maze[0].length && y < maze.length;
}

function create_path(){
    let entrance,exit;

    if(random_flip()){
        entrance = {
            x:0,
            y:random_int(1,maze.length-1)
        }
        exit = {
            x:maze[0].length-1,
            y:random_int(1,maze.length-1)
        }
        entrance.y = set_to_odd(entrance.y);
        exit.y = set_to_odd(exit.y);
    }else{
        entrance = {
            x:random_int(1,maze[0].length-1),
            y:0
    }
    exit = {
        x:random_int(1,maze[0].length-1),
        y:maze.length-1
        }
        entrance.x = set_to_odd(entrance.x);
        exit.x = set_to_odd(exit.x);
    }
    try{
        maze[entrance.y][entrance.x] = open;
        maze[exit.y][exit.x] = open;
    }catch(error){
        console.error('Error creating entrance and exit:', error);
        console.error('Entrance coordinates:', entrance);
        console.error('Exit coordinates:', exit);
    }
    last_entrance = entrance;
    last_exit = exit;
}

function draw_maze(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    for(let y=0; y<maze.length; y++){
        for(let x=0; x<maze[y].length; x++){

            let tile = maze[y][x];
            let img;

            if(tile === closed){
                img = wallImage;
            }
            else{
                img = openImage;
            }
            ctx.drawImage(
                img,
                x * tile_size,
                y * tile_size,
                tile_size,
                tile_size
            );
        }
    }
}

//helper functions//
function random_int(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
function random_flip(){
    return Math.random() < 0.5;
}

//fisher-yates shuffle
function shuffle_array(array){
    let copy = [];
    for(let i = 0;i<array.length;i++){
        copy.push(array[i]);
    
    }

    for(let i =0;i<copy.length;i++){
        let random_index = random_int(0,copy.length-1);

        let temp = copy[random_index];
        copy[random_index] = copy[i];
        copy[i] = temp;
    }
    return copy;
}


function create_2D_array(width, height,fill_value){

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
function set_to_odd(number){
    return (number % 2 == 1) ? number  : number + 1;
}

//place obstactle

function place_obstacle(count){
    let placed = [];

    for(let i = 0; i < maze.length; i++){
        for(let j = 0; j < maze[i].length; j++){
            if(maze[i][j] === open && !(j === last_entrance.x && i === last_entrance.y) && !(j === last_exit.x && i === last_exit.y) && !(player.x == j && player.y == i)){
                placed.push({x:j,y:i});
            }
        }
    }

    placed = shuffle_array(placed);

    for(let i = 0; i < count && i < placed.length; i++){
        let tile = placed[i];
        obstacle.push({
            x: tile.x,
            y: tile.y,
            type: "banana_question"
        });
    }
}

function draw_obstacles(){
    for(let i = 0; i < obstacle.length; i++){
        let obs = obstacle[i];
        animateQuestion(obs.x * tile_size, obs.y * tile_size);
    }
}

create_maze();