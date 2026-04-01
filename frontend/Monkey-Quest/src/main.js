import User from "./User.js";
const loader = document.getElementById("loadingOverlay");


//user object 

let user = null;
let answer = false;

function showLoader() {
    loader.style.display = "flex";
}

function hideLoader() {
    loader.style.display = "none";
}


async function getBackendUser() {
    try {
        const res = await fetch("http://localhost:4000/app/v1/users/me", {
            credentials: "include"
        });

        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        return null;
    }
}

function getLocalUser() {
    const data = localStorage.getItem("User");
    const session = sessionStorage.getItem("ActiveSession");

    if (data && session) {
        return JSON.parse(data);
    }
    return null;
}

async function initUser() {

    const backendUser = await getBackendUser();

    if (backendUser) {
        console.log("GitHub user detected");

        return new User(
            backendUser.id,
            backendUser.username,
            backendUser.level,
            backendUser.coins
        );
    }


    const localUser = getLocalUser();

    if (localUser) {
        console.log("Local user detected");

        return new User(
            1,
            localUser.name,
            localUser.level,
            localUser.coins
        );
    }


    console.log("No user found");
    window.location.href = "index.html";
    return null;
}

(async () => {
    try {
        showLoader(); 

        user = await initUser();

        if (!user) return;

        user.player_init_level();
        user.updateDashBoardDisplay();
    } catch (error) {
        console.log(error);
    } finally {
        hideLoader(); 
    }
})();

async function logout() {
    try {
      
        await fetch("http://localhost:4000/app/v1/users/logout", {
            method: "GET",
            credentials: "include"
        });
    } catch (err) {
        console.log("Backend logout failed");
    }

 
    localStorage.removeItem("User");
    sessionStorage.removeItem("ActiveSession");

    
    window.location.href = "index.html";
}

document.getElementById("log-out").addEventListener("click", () => {
    logout();
});

document.addEventListener("keydown", (e) => {

   // if(e.repeat) return;

    let keyMap = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
    };

    if(keyMap[e.key]){

        let btn = document.getElementById(keyMap[e.key]);
        btn.classList.add("active");

        setTimeout(()=>{
            btn.classList.remove("active");
        },120);

        user.game.handleInput(e);
    }
});



document.getElementById("banana_question_form").addEventListener("submit", (e)=>{
    e.preventDefault();

    let userAnswer = Math.round(
        Number(document.getElementById("msg").value)
    );

    const isCorrect = user.game.submitAnswer(userAnswer);

    document.getElementById("msg").value = "";

    
    if(isCorrect){
        user.claim_Coins({
            level: user.level,
            complete: true
        });
        if(user.id !== 1){
            user.saveToDB();
        }else{
            user.save();
        }
        
        user.updateDashBoardDisplay();
    }
});

