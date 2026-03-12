import Home from './Home.jsx';
import Login from './Login.jsx';
import Game from './Game.jsx';
import {useEffect,useState} from "react";


function App(){
    const [page, setPage] = useState("home");
    const [user, setUser] = useState(null);

    
  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    const session = sessionStorage.getItem("loggedIn");

    if(savedUser && session){
      setUser(savedUser);
    }
  }, []);


    return(

    <>
  
      {page === "home" && <Home setPage={setPage} user={user} />}

      {page === "login" && <Login setUser={setUser} setPage={setPage} />}

      {page === "game" && <Game/>}
    
    </>
    );
} 

export default App