const express = require('express');
const authentication = require('../middleware/authentication');
const User = require('../model/user');
const route = express.Router();

route.get("/home/chats", authentication, async (req, res)=>{
    try{
        const chats = await User.findOne({email: req.user['email']});
        res.send(chats);
    } catch( err ){
        console.log(err);
    }
});

module.exports = route;