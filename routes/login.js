const express = require('express');
const route = express.Router();
const path = require('path');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

route.get("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, "../views/login.html"));
});
async function userExits(req, res, next){
    let {email, password} = req.body;
    const person = await User.findOne({"email":email,});
    if(person){
        if(bcrypt.compareSync(password,person['password'])){
            const loginUser = {
                username: person['username'],
                email: person['email']
            }
            req.user = loginUser;
            next();
        } else{
            res.send("invalid password");
        }
    }else{
        res.send("user not find");
    }
}
route.post("/login", userExits, async (req, res)=>{
    const token = jwt.sign(req.user, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.cookie("access_token", token, {
        httpOnly: true,
    })
    res.redirect('/home');
});
module.exports = route;