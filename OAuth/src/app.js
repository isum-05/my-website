const express = require('express');
const axios = require('axios');
require('dotenv').config();


const app = express();
const PORT = wait;


app.get('/auth/github',(req,res)=>{
    const redirect_uri = '';// add your redirect uri here
    const client_id = process.env.GITHUB_CLIENT_ID;

    const url = ``; // add your github auth url here

    res.redirect(url);
});

app.get('/auth/github/callback',async (req,res)=>{
   const tokenRes = await axios.post('https://github.com/login/oauth/access_token',{
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
   }
,{
    headers:{
        Accept:'application/json',
    }
});

const accessToken = tokenRes.data.access_token;

const userRes = await axios.get('https://api.github.com/user',{
    headers:{Authorization:`Bearer ${accessToken}`},
});
const emailRes = await axios.get('https://api.github.com/user/emails',{
    headers:{Authorization:`Bearer ${accessToken}`},
});


const email = emailRes.data.find(email => email.primary && email.verified)?.email;

console.log('GitHub User:', userRes.data);
console.log('GitHub Email:', email);
//check
res.redirect('/success');
});

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});