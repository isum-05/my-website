import {User} from "../models/user.model.js";
import axios from "axios";


const githubAccess = async(req,res) =>{
    try {
        const redirect_uri = process.env.GITHUB_REDIRECT_URI;
        const client_id = process.env.GITHUB_CLIENT_ID;

        if (!client_id || !redirect_uri) {
            return res.status(500).json({ message: "OAuth config missing" });
        }
        const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`;

        res.redirect(url);
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error.message});
    }
}


const registerUser = async (req, res) => {
    try {
        const tokenRes = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: req.query.code,
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = tokenRes.data.access_token;

        if (!accessToken) {
            return res.status(400).json({ message: "OAuth failed" });
        }

        const userRes = await axios.get(
            'https://api.github.com/user',
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const emailRes = await axios.get(
            'https://api.github.com/user/emails',
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const { login, id } = userRes.data;

        const primaryEmailObj = emailRes.data.find(e => e.primary && e.verified);
        const email = primaryEmailObj?.email;

        if (!login || !id || !email) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { githubId: id }
            ]
        });

        if (!user) {
            user = await User.create({
                username: login,
                email: email.toLowerCase(),
                githubId: id,
                coins: 0,
                level: 0
            });
        }

        req.session.userId = user._id;

        res.redirect("http://localhost:5173/game.html");

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};  

const getCurrentUser = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not logged in" });
        }
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user._id,
            username: user.username,
            level: user.level,
            coins: user.coins
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Logout failed",
                error: err.message
            });
        }

        res.clearCookie("connect.sid"); 
        res.json({ message: "Logged out" });
    });
};

export{
    registerUser,
    githubAccess,
    getCurrentUser,
    logoutUser
};