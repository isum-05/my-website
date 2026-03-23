import Game from "./Game";
class User{
    constructor(name,level=0,coins=0){
        this.name = name;
        this.level = level;
        this.coins = coins;
        this.game = null;
        this.levelsBoard = {
        0: { goal: 1000, reward: 500, size: [11,11], difficulty: 1 ,profile:"img/Level/0.png"},
        1: { goal: 2000, reward: 1000, size: [13,13], difficulty: 2 ,profile:"img/Level/1.png"},
        2: { goal: 3500, reward: 1500, size: [15,15], difficulty: 3 ,profile:"img/Level/2.png"},
        3: { goal: 5500, reward: 2000, size: [15,15], difficulty: 4 ,profile:"img/Level/3.png"},
        4: { goal: 7000, reward: 2500, size: [17,17], difficulty: 5 ,profile:"img/Level/4.png"},
        5: { goal: 10000, reward: 3000, size: [17,17], difficulty: 6 ,profile:"img/Level/5.png"}
        };
    }

    player_init_level(){
        const levelData = this.levelsBoard[this.level];

        const [rows, cols] = levelData.size;
        const difficulty = levelData.difficulty;

        this.game = new Game("maze",rows, cols, difficulty,this);
        this.game.start();
    }
    level_up() {
        let newLevel = 0;

        const levels = Object.keys(this.levelsBoard)
            .map(Number)
            .sort((a, b) => a - b);

        for (let lvl of levels) {
            if (this.coins >= this.levelsBoard[lvl].goal) {
                newLevel = lvl + 1; 
            } else {
                break;
            }
        }

    
        const maxLevel = levels.length - 1;
        if (newLevel > maxLevel) newLevel = maxLevel;

        if (newLevel !== this.level) {
            this.level = newLevel;
            this.updateDashBoardDisplay();
            this.save();
            return true;
        }

        return false;
    }
    update_coins(coin){
        this.coins += coin;
        this.level_up(); 
    }
    claim_Coins({level, complete}){

        if (!complete) return; 

        const reward = this.levelsBoard[level]?.reward || 0;
        this.coins += reward;
        this.updateDashBoardDisplay();

    }

    save(){
        localStorage.setItem("User", JSON.stringify({
            name: this.name,
            level: this.level,
            coins: this.coins
        }));
        sessionStorage.setItem("ActiveSession", "true");
        console.log("Local user saved to localStorage");
    }
    static load(){
        const data = localStorage.getItem("User");
        if (data) {
            const obj = JSON.parse(data);
            return new User(obj.name, obj.level, obj.coins);
        }
        return null;
    }
    animateScore(element, start, end, duration = 500) {
        if (!element) return;

        let startTime = null;

        const update = (currentTime) => {
            if (!startTime) startTime = currentTime;

            const progress = Math.min((currentTime - startTime) / duration, 1);
            const value = Math.floor(start + (end - start) * progress);

            element.textContent = `${value}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
    updateDashBoardDisplay(){
        document.getElementById("level-display").textContent = `Level ${this.level}`;
        const scoreEl = document.querySelector("#score-display .score-text");

        this.animateScore(scoreEl, 0, this.coins, 600);
        document.getElementById("profile").textContent = `${this.name}`;
        const img = document.getElementById("levelImg");
        img.src = this.levelsBoard[this.level].profile;
        
        document.getElementById("unlock").textContent = `Goal: ${this.levelsBoard[this.level].goal}`;
        
    }

}

export default User;