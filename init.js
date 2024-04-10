const User = require('./model/user');
const mongoose = require('mongoose');

main()
.then(()=> console.log('connected to database'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chatApp');
}

// User.findOneAndUpdate({_id: '660eef9163293fa1177029bf'}, {
//     $push:{
//         message: [
//             {user: "pankaj"},
//             {roomName: "new room"},
//             {
//                 from:"rudra",
//                 to: "joe",
//                 msg: "hit",
//                 time: "12:00"
//             }
//         ]
//     }
// }).then(()=>{
//     console.log('saved');
// }).catch((err)=>{
//     console.log(err)
// })


// User.findOneAndUpdate({_id: '660ee6561fd071246bf68e8c'}, {
//     $push:{
//         "message": }
// }).then(()=>{
//     console.log('saved');
// }).catch((err)=>{
//     console.log(err)
// })
// 

// let q = `message.1.0.user`
// let query = {};
// query[q] = 'pankaj'
// User.findOne(query).then((res)=>{
//     let chat = res['message']
//     console.log('saved', res['message']);
// }).catch((err)=>{
//     console.log(err)
// })

// async function saving(firstUser, secondUser){
//   let roomID = "41122e58-e17a-4b0e-8189-b2789aeb0744"
//   try{
//     await User.findOneAndUpdate({ email : secondUser['email']}, {
//         $push:{
//             "message":[
//                 {username : firstUser['username']},
//                 {email: firstUser['email']},
//                 {roomID: roomID}
//             ]
//         }
//     });
  
//   } catch(err){
//     console.log(err);
//   }

// }

// saving( {
//   username:'rudra',
//   email:'w@w'
// }, {
//   username: 'rudra',
//   email: 'y@y'
// })