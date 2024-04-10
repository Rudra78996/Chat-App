import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io("/userChat");

let form = document.querySelector('form');
let message = document.querySelector('#message');
let chat = document.querySelector('#messageContainer');
let chatSender = document.querySelector("#user");
chatBottom();



function chatBottom() {
    chat.scrollTop = chat.scrollHeight;
}

form.addEventListener('submit', async (event)=>{
    if(message.value){
        event.preventDefault();
        let p = document.createElement('p');
        p.classList.add("from-me")
        let msg = message.value;
        message.value = "";
        p.innerText = msg;
        const currentURL = window.location.href;
        chat.appendChild(p);
        chatBottom();
        socket.emit("message", {
            msg: msg,
            to : chatSender.innerText
        });
        try{
            let reqResult = await axios.post("/message/save", {
                message: msg,
                url: currentURL
            });
        } catch(err){
            console.log(err);
        }
    }
});
socket.on("private message", async (msg)=>{
    let p = document.createElement('p');
    if(msg['user']==chatSender.innerText){
        p.classList.add("from-me");
    }else{
        p.classList.add("from-them");
    }
    p.innerText = msg['msg'];
    chat.appendChild(p);
    chatBottom();
});
