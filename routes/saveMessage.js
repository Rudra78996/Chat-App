const express = require('express');
const authentication = require('../middleware/authentication');
const route = express.Router();
const User = require('../model/user');

async function saveMessage(sender, message, roomID){
    try{
        let reqResult = await User.findOneAndUpdate({
            email: sender['email'],
            'message': {
                $elemMatch: {
                    $elemMatch: {
                        "roomID": roomID
                    }
                }
            }},
            {
                $push: {
                  "message.$[elem]": {
                    from: sender['username'],
                    msg:message,
                    time: new Date()
                  }
                }
            },
              {
                arrayFilters: [{"elem.roomID": roomID}],
                new: true 
              });
        // console.log(reqResult);
        for(let i of reqResult['message']){
            if(i[2]['roomID']==roomID){
                return {email: i[1]['email'], username: sender['username']};
            }
        }
    }catch(err){
        console.log(err);
    }
}

route.post("/message/save", authentication, async (req, res)=>{
    let {message, url} = req.body;
    try{
        let arr = url.split("/");
        let sender = {
            email: req.user['email'],
            username: req.user['username']
        }
        const roomID = arr[arr.length-1];
        let receiver = await saveMessage(sender, message, roomID);
        await saveMessage(receiver, message, roomID);
    }catch(err){
        console.log(err);
    }
})
module.exports = route;