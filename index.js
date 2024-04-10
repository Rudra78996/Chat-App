const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./model/user');
const http = require('http');
const {Server} = require('socket.io');
const cookieParse = require('cookie-parser');
const authentication = require('./middleware/authentication');
const bodyParser = require('body-parser');

const port = 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);
module.exports = io;

app.use(express.urlencoded({extended:false}));
app.use(cookieParse());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "/public/JS/")));
app.use(express.static(path.join(__dirname, "/public/style/")));
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());

server.listen(port, ()=>{
    console.log(`app is connected to port ${port}`);
});

main()
.then(()=> console.log('connected to database'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chatApp');
}


app.use("/", require("./routes/login"));
app.use("/", require("./routes/register"));
app.use("/", require("./routes/logout"));
app.use("/", require("./routes/home"));
app.use("/", require("./routes/chats"));
app.use("/", require("./routes/saveMessage"));

app.get("/", authentication, (req, res)=>{
    res.redirect("/home");
});
