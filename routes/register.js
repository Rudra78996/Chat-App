const express = require('express');
const route = express.Router();
const path = require('path');
const User = require("../model/user");
const bcrypt = require('bcryptjs');

route.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, "../views/createAccount.html"));
});
async function uniqueUser(req, res, next){
    let registerUser = await User.findOne({"email": req.body.email});
    if(!registerUser){
        next();
    }else{
        res.send("user exists");
    }
}
route.post("/register", uniqueUser, async (req, res)=>{
    let { name, email, password} = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const registerUser = new User({"username":name, "email": email, "password": hashPassword});
    let result = await registerUser.save();
    console.log(result);
    res.redirect("/login");     
});
module.exports = route;