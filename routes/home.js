const express = require('express');
const authentication = require('../middleware/authentication');
const route = express.Router();
const User = require("../model/user");
const { v4: uuidv4 } = require('uuid');
const io = require("../index");
const jwt = require('jsonwebtoken');

route.get("/home", authentication, async (req, res)=>{
    try{
        let user = await User.findOne({ email: req.user['email']});
        res.render('home.ejs', {user});
    } catch(err){
        console.log(err);
    }
});

async function createRoom(firstUser, secondUser){
    const roomID = uuidv4();
    // console.log(firstUser, secondUser);
    try{
        let result = await User.findOneAndUpdate({email: firstUser['email']},{
          $push:{
            "message":[
                {username: secondUser['username']},
                {email : secondUser['email']},
                {roomID: roomID},
            ]
          }  
        });
        console.log(result);
    } catch( err){
        console.log(err);
    }
    try{
        await User.findOneAndUpdate({ email : secondUser['email']}, {
            $push:{
                "message":[
                    {username : firstUser['username']},
                    {email: firstUser['email']},
                    {roomID: roomID}
                ]
            }
        });

    } catch(err){
        console.log(err);
    }
    return roomID;
}

async function checkingContact(req, res, next){
    try{
        let { contact : userEmail } = req.body;
        let user = await User.findOne({ email : req.user['email']});
        for( let chat of user['message']){
            if(chat[1]['email']== userEmail){
                console.log('user already exists in contact');
                return res.status(400).send({
                    message: 'already in contact'
                });
            }
        }
        next();
    } catch(err){
        console.log(err);
    }
}

route.post("/home/add-contact", authentication, checkingContact, async (req, res)=>{
    let { contact : userEmail } = req.body;
    if(req.user['email'] == userEmail){
        return res.status(400).send({
            message: 'you can not message you self'
        });
    }
    try{
        const user = await User.findOne({ "email": userEmail});
        if(!user){
            return res.status(400).send({
                message: 'User not exits'
            });
        }
        let roomID = await createRoom(req.user, user);
        res.send({
            url: `/chat/${roomID}`,
            username: user['username']
        });
    } catch(err){
        console.log(err);
    }
});

let id;

route.get("/home/:id", authentication, async (req, res)=>{
   id = req.params['id'];
    try{
        let user = await User.findOne({email: req.user['email']});
        for(let chat of user['message']){
            if(chat[2]['roomID']==id){
                res.render('userChat.ejs', {chat});
            }
        }
    }catch(err){
        console.log(err);
    }
});

//socket io part

io.of("/userChat").on("connection", (socket)=>{
    socket.join(id);
    console.log('connected', id);
    socket.on("message", (msg)=>{
        // console.log(msg);
        socket.to(id).emit("private message", {msg:msg['msg'], user: msg['to']});
    });
    socket.on("disconnect", ()=>{
        socket.leave(id);
    });
});

let onlineNamespace = io.of("/online"); 

onlineNamespace.on("connection", (socket)=>{
    const cookies = socket.request.headers.cookie;
    let array = cookies.split(" ");
    let token = null;
    let user = null;
    for(let c of array){
        if(c.slice(0, c.indexOf("="))=="access_token"){
            token = c.slice(c.indexOf("=")+1,)
        }
    }
    try{
        const data = jwt.verify(token, process.env.SECRET_KEY);
        user = data['email'];
    }
    catch(err){
        console.log(err);
    }
    onlineNamespace.emit("online", user);
    socket.on('disconnect', ()=>{
        console.log("offline");
    });
});

module.exports = route;