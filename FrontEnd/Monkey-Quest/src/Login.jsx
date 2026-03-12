import{useState} from "react";

function Login({ setUser, setPage }) {

    const [userName,setUserName] = useState("");

    function login_user(){
        localStorage.setItem("username", userName);
        sessionStorage.setItem("loggedIn","true");

        setUser(userName);
        setPage("game");
    }

    return(

        <>
        <h2>Login</h2>

        <input
            type="text"
            placeholder="Username"
            onChange={(e)=>setUserName(e.target.value)}
        />

        <button onClick={login_user}>Login</button>
            
        
        </>
    );
}

export default Login;