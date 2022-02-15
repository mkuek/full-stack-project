//login to my dashboard (gets my username and room from the search bar)
//login page must (must enter my username and pw, gives me a unique room)
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
// console.log(username, room);
// console.log(room);

const socket = io();

//userID obtained from rendered dashboard home page(not sure this is needed for anything)
//! const userID = document.querySelector(".id");
const username = document.querySelector(".name > span").innerHTML;
console.log(username);

//cannot get this to work

//write active chats to the sidebar using userMessagesObject
// socket.on("write-active-chats", (userMessagesData) => {
//   console.log(userMessagesData); //coming up empty for some reason
// });
// socket.on("userMessagesData", (userMessagesData) => {
//   console.log(`home.js ${userMessagesData}`); //coming up empty for some reason
// });

//input box for pasting a roomID shared with you
const newChat = document.querySelector(".chat-code-input");
newChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputBox = document.querySelector(".chat-code-input > input");
  const roomID = inputBox.value;
  console.log(`line 32: ${roomID}`);
  //join room (w/username)
  socket.emit("joinRoom", { username, roomID });

  // writeActiveChats(username, roomID);
  //clear the chat input box, and focus on the box after button click
  inputBox.value = "";
  inputBox.focus();
});

//writes new chats in the sidebar, sends info to the server about the created room.
//same as above
// function writeActiveChats(username, roomID) {
//   const activeChats = document.querySelector(".active-chats");
//   const newChat = document.createElement("div");
//   console.log(username);
//   newChat.textContent = `${username}`;
//   activeChats.appendChild(newChat);
//   //not sure what to do with this yet
//   socket.emit("new-room-created", { username, roomID });
// }

let currentRoom = "";
let roomChange = "";

//input box for sending a message (to those in the the same room)
const messageSubmitButton = document.querySelector(".message-submit-button");
messageSubmitButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("click");
  const messageInput = document.querySelector(".message-input");
  const msg = messageInput.value;
  console.log(`line 60 ${msg}`);
  //send message to the server
  socket.emit("chatMessage", msg, currentRoom);
  //clear the chat input box, and focus on the box after button click
  messageInput.value = "";
  messageInput.focus();
});

//generate a random invite room Id to email to someone (would be best to set this up to actually email someone)
const inviteButton = document.querySelector(".invite-button");
inviteButton.addEventListener("click", () => {
  //!send userID here (go to top of page - requires database query at login) rather than username(as seen below)
  socket.emit("get-invite-code", username);
});

//on receiving a formatted message, calls function to output message to the browser chat window
socket.on("message", (formattedMessage, roomID) => {
  console.log(`line 80`);
  console.log(formattedMessage);
  //writes messages received from the server in the clients browser
  outputMessage(formattedMessage, roomID);
  //autoscrolls messages down
  const chatWindow = document.querySelector(".chat-window");
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

//

//outputs message to the chat window
function outputMessage(message, roomID) {
  // console.log(`line 91, client-side: ${roomID}`);
  const div = document.createElement("div");
  //assign messages as "own" or "other"
  if (message.username === username) {
    div.classList.add("own-message");
  } else {
    div.classList.add("other-message");
  }
  div.classList.add("message");
  div.innerHTML = `<p class="message-username">${message.username} <span>${message.time}</span></p>
            <p class="message-text">${message.text}</p>`;
  console.log(`line 104, room change is: ${roomChange}`);
  if (roomChange === "false") {
    // console.log(`roomID = ${roomID}`);
    // console.log(`current room = ${currentRoom}`);
    // console.log("roomID == currentRoom");
    document.querySelector(".chat-window").appendChild(div);
  } else {
    // console.log(currentRoom[0]);
    // console.log("roomID !== currentRoom");
    document.querySelector(".chat-window").replaceChildren(div);
    roomChange = "false";
    console.log(`room change: ${roomChange}`);
  }
}

//not sure if this is needed
// //event listeners for the active chats in sidebar
// const activeChats = document.querySelector(".active-chats");
// activeChats.addEventListener("click", (e) => {
//   //would like to click on this and write the dom with all the chats for this particular room"
//   //i think i would also like to "join" all the rooms for which I have active chats
// });

//event listener for chat groups sidebar, joins specific room on button click (also sets current room to determine what is shown in the DOM)
const chat = document.querySelectorAll(".hidden-roomId");
chat.forEach((chat) => {
  chat.addEventListener("click", (event) => {
    const roomID = event.target.id;
    // currentRoom = roomID;
    // console.log(` line 115:${event.target.id}`);
    console.log(`line 131, current room is ${currentRoom}`);
    if (roomID === currentRoom) {
      currentRoom = roomID;
      roomChange = "false";
      console.log(`room changed to ${roomChange}`);
      socket.emit("joinRoom", { username, roomID, roomChange });
      // window.location.reload();
    } else {
      currentRoom = roomID;
      roomChange = "true";
      console.log(`room changed to ${roomChange}`);
      // console.log(`directly after push: ${currentRoom}`);
      socket.emit("joinRoom", { username, roomID, roomChange });
    }
    // currentRoom.shift();
  });
});
