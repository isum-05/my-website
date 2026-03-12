import {useEffect,useState} from "react";

function Home({setPage,user}){
    const [joke, setJoke] = useState("Thinking ....");

    useEffect(()=>{
        monkeyJoke();
        const timer = setInterval(monkeyJoke,5000);

        return ()=> clearInterval(timer)
    },[]);


    function monkeyJoke(){
        fetch("https://icanhazdadjoke.com/", {
            headers: { "Accept": "application/json" }
        })
        .then(res => res.json())
        .then(data => {
            setJoke(data.joke);
        });
    }

    function checkPlayer(){
        const savedUser = localStorage.getItem("username");
        const session = sessionStorage.getItem("loggedIn");

        if(savedUser && session){
        setPage("game");  
        }
        else{
        setPage("login");  
        }

    }

    return(
        <div className="container">
            <div className="left-section">
                <div className="logo-image">
                    <img src="src/assets/logo2.png" alt="MonkeyQuest game logo featuring a monkey character in a vibrant jungle setting" />
                </div>
                <div className="popup-section"></div>
            </div>
            <div className="right-section">
                <div className="Monkey-message-section">
                    <div className="text-box" >
                        {joke}
                    </div>
                </div>
                <div className="play-dashboard">
                    <button className="play" onClick={checkPlayer}><img src="/src/assets/playImg.png" alt="Play button to start the MonkeyQuest maze game" /></button>
                </div>
            </div>
        </div>
    );
}

export default Home 