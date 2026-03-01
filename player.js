const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 200;
const CANVAS_HEIGHT = canvas.height = 200;



const playerImage = new Image();
playerImage.src = 'image/sprite_sheet (1).png';
const spriteWidth = 41;
const spriteHeight = 43;
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggerFrames = 7;

const spriteAnimations = [];

const animationStates = [
    { 
        name:"idle",
        frames: 7
    }
];

animationStates.forEach((state,index)=>{
    let frames = {
        loc:[],
    }
    for(let j=0; j<state.frames; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x:positionX,y:positionY});
    }
    spriteAnimations.push(frames);
});

function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    let position = Math.floor(gameFrame/staggerFrames) % 8;
    frameX= spriteWidth * position;
    ctx.drawImage(playerImage, frameX,frameY * spriteHeight,spriteWidth,
    spriteHeight,0,0,spriteWidth,spriteHeight);

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();