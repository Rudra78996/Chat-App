import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io("/online");

let addBtn = document.querySelector("#add_contact");
let contactEmail = document.querySelector("#contact");
let addContactForm = document.querySelector("#add_contact"); 
let ul = document.querySelector("ul");
addContactForm.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const li = document.createElement('li');
    try{
      const link = await axios.post("/home/add-contact", {
        contact : contactEmail.value
      });
      li.innerHTML = `<a href="${link['data']['url']}" > ${link['data']['username']}</a>`;
      document.querySelector('ul').append(li);
      contactEmail.value = "";

    } catch(err){

      let message = err.response.data['message']; 
      let p = document.createElement('p');
      p.innerText = message;
      contactEmail.value = "";
      ul.appendChild(p)

      setTimeout(()=>{
        ul.removeChild(p);
      }, 1000)
    }
}); 

// socket.on("online", (user)=>{
//   let update = document.getElementById(`${user}`);
//   if(update){
//     let p = document.createElement('span')
//     p.innerText = "online";
//     update.appendChild(p)
//   }
// });