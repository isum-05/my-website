require('dotenv').config(); // must be first
const express = require('express');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require("./models/user");

const app = express();
const PORT = 4001;


console.log("Mongo URI:", process.env.MONGO_URI);
console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => {
    console.error("MongoDB Connection Error:", err);
});


app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth/github',(req,res)=>{
    const redirect_uri = 'http://localhost:4001/auth/github/callback';// add your redirect uri here
    const client_id = process.env.GITHUB_CLIENT_ID;

    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`; // add your github auth url here

    res.redirect(url);
});

app.get('/auth/github/callback', async (req,res)=>{

try{

    const tokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: req.query.code,
        },
        {
            headers:{ Accept:'application/json' }
        }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get(
        'https://api.github.com/user',
        { headers:{ Authorization:`Bearer ${accessToken}` } }
    );

    const emailRes = await axios.get(
        'https://api.github.com/user/emails',
        { headers:{ Authorization:`Bearer ${accessToken}` } }
    );

    const email = emailRes.data.find(
        email => email.primary && email.verified
    )?.email;

    let user = await User.findOne({
        githubId:userRes.data.id
    });

    if(!user){

        user = new User({

            githubId:userRes.data.id,
            name:userRes.data.login,
            email:email

        });

        await user.save();

        console.log("New user created:",user.name);

    }else{

        console.log("Existing user logged in:",user.name);

    }

    res.redirect(
        `http://localhost:4001/game.html?userid=${user._id}`
    );

}
catch(err){

    console.error(err);
    res.send("GitHub authentication failed");

}

});

app.get("/api/user/:id", async (req,res)=>{

    try{

        const user = await User.findById(req.params.id);

        res.json(user);

    }catch(err){

        console.error(err);
        res.status(500).send("User load failed");

    }

});
app.post("/api/save-progress", express.json(), async (req,res)=>{

try{

    const { userid, coins, level } = req.body;

    const updatedUser = await User.findByIdAndUpdate(

        userid,

        {
            coins: coins,
            level: level
        },

        { new:true }

    );

    res.json({
        status:"saved",
        user:updatedUser
    });

}
catch(err){

    console.error(err);
    res.status(500).json({
        status:"error"
    });

}

});
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});