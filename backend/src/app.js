import express from "express";
import session from "express-session";
import cors from "cors";
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}));
app.use(express.json());

app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,   
        httpOnly: true,
        sameSite: "lax"
    }
}));

import userRouter from "./routes/user.route.js"

app.use("/app/v1/users",userRouter);


export default app;