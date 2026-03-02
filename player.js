const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 200;
const CANVAS_HEIGHT = canvas.height = 200;


const playerImage = new Image();
playerImage.src = 'image/spriteSheet.png';
const spriteWidth = 64;
const spriteHeight = 64;
let gameFrame = 0;
const staggerFrames = 7;

const spriteAnimations = [];

const animationStates = [
    { 
        name:"back",
        frames:8
    },

    {
        name:"back_left",
        frames:6
    },
    {
        name:"side_left",
        frames:10
    },

    {
        name:"front_left",
        frames:8
    },

    {
        name:"front",
        frames:10
    },

    {
        name:"front_right",
        frames:8
    },

    {
        name:"side_right",
        frames:12
    },

    {
        name:"back_right",
        frames:6
    },

    {
        name:"jump",
        frames:15
    },

    {
        name:"roll",
        frames:6
    },
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
    spriteAnimations[state.name] = frames;
});
console.log(spriteAnimations);

function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations['front'].loc.length;
    let frameX= spriteWidth * position;
    let frameY = spriteAnimations['front'].loc[position].y;

    ctx.drawImage(playerImage, frameX,frameY,spriteWidth,
    spriteHeight,0,0,30,30);

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();