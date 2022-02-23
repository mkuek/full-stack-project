// let socket = io();

// //userID obtained from rendered dashboard home page
// //! const userID = document.querySelector(".id");
// const username = document.querySelector(".name > span").innerHTML;
// console.log(username);

// //input box for pasting a roomID shared with you
// const newChat = document.querySelector(".chat-code-input");
// newChat.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const inputBox = document.querySelector(".chat-code-input > input");
//   const roomID = inputBox.value;
//   console.log(`line 32: ${roomID}`);
//   //join room (w/username)
//   socket.emit("joinRoom", { username, roomID });
//   //clear the chat input box, and focus on the box after button click
//   inputBox.value = "";
//   inputBox.focus();
// });

// let currentRoom = "";
// let roomChange = "";
// let userSocketId = "";
// let userInfoForReset = "";

// //input box for sending a message (to those in the the same room)
// const messageSubmitButton = document.querySelector(".message-submit-button");
// messageSubmitButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log("click");
//   const messageInput = document.querySelector(".message-input");
//   const msg = messageInput.value;
//   console.log(`line 60 ${msg}`);
//   //send message to the server
//   console.log(`this is the current room ${currentRoom}`);
//   socket.emit("chatMessage", msg, currentRoom);
//   //clear the chat input box, and focus on the box after button click
//   messageInput.value = "";
//   messageInput.focus();
// });

// //generate a random invite room Id to email to someone (would be best to set this up to actually email someone)
// const inviteButton = document.querySelector(".invite-button");
// inviteButton.addEventListener("click", () => {
//   //!send userID here (go to top of page - requires database query at login) rather than username(as seen below)
//   socket.emit("get-invite-code", username);
// });

// //on receiving a formatted message, calls function to output message to the browser chat window
// socket.on("message", (formattedMessage, roomID) => {
//   //!message does not get received here after room change

//   console.log(`line 52 - message received`);
//   console.log(formattedMessage);
//   //writes messages received from the server in the clients browser
//   outputMessage(formattedMessage, roomID);
//   //autoscrolls messages down
//   const chatWindow = document.querySelector(".chat-window");
//   chatWindow.scrollTop = chatWindow.scrollHeight;
// });

// //outputs message to the chat window
// function outputMessage(message, roomID) {
//   const div = document.createElement("div");
//   //assign messages as "own" or "other" (would want way to select additional colors for more than 2 people in chatroom)
//   if (message.username === username) {
//     div.classList.add("own-message");
//   } else {
//     div.classList.add("other-message");
//   }
//   div.classList.add("message");
//   div.innerHTML = `<p class="message-username">${message.username}<button id = "close"></button></p>
//             <p class="message-text">${message.text}</p>
//             <p class = "message-time">${message.time}</p>`;
//   console.log(`line 104, room change is: ${roomChange}`);
//   //overwrites the chat window contents when a new room (chatroom) is entered
//   if (roomChange === "false") {
//     document.querySelector(".chat-window").appendChild(div);
//   } else {
//     document.querySelector(".chat-window").replaceChildren(div);
//     roomChange = "false";
//     console.log(`room change: ${roomChange}`);
//   }
// }

// socket.on("userSocketId", (user) => {
//   console.log(user.id);
//   userSocketId = user.id;
//   userInfoForReset = user;
// });

// //event listener for chat groups sidebar, joins specific room on button click (also sets current room to determine what is shown in the DOM)
// const chat = document.querySelectorAll(".hidden-roomId");
// chat.forEach((chat) => {
//   chat.addEventListener("click", (event) => {
//     const roomID = event.target.id;
//     //sets the clicked room (chatroom) to the current room (records whether there was a room change)
//     if (roomID === currentRoom) {
//       currentRoom = roomID;
//       roomChange = "false";
//       console.log(`room changed to ${roomChange}`);
//       socket.emit("joinRoom", { username, roomID, roomChange });
//     } else {
//       //!disconnect socket for that room, passing user info to re-connect to new room

//       // socket.emit("disconnectSocket", userInfoForReset);
//       if (currentRoom == "") {
//         currentRoom = roomID;
//         roomChange = "true";
//         console.log(`room changed to ${roomChange}`);
//         socket.emit("joinRoom", { username, roomID, roomChange });
//       } else {
//         currentRoom = roomID;
//         roomChange = "true";
//         console.log(
//           `selected a new room section, client line 106 ${userInfoForReset.id}`
//         );
//         //disconnects the user (socket) after clicking a new contact to chat with (passes user info, specifically the socket id)
//         socket.emit("disconnectSocket", userInfoForReset);
//         // socket.on("disconnect", function () {
//         //   console.log("disconnected from socket client side!!!!");
//         // });
//         // //reconnect to the server (set up a new socket), and report re-connection
//         // socket = io("http://localhost:3000/");
//         // socket.on("connect", () => {
//         //   console.log("socket reconnected");
//         // });
//         console.log(`username ${username}, roomID ${roomID}, ${roomChange}`);
//         socket.emit("joinRoom", { username, roomID, roomChange });
//       }
//     }
//   });
// });
const socket = io("http://localhost:3000/");
const messages = document.querySelector(".chat-window");
const msgForm = document.querySelector(".chat-input");
const currentUser = document.querySelector(".user-details").id;

socket.on("message", (data) => {
  console.log(data);
  appendMessages(data);
});
socket.on("output-messages", (data) => {
  console.log(data);
  if (data.length) {
    data.forEach((message) => {
      appendMessages(message);
    });
  }
});
socket.on("disconnected", (data) => {
  appendMessages(data);
});
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = {
    sender: currentUser,
    msg: msgForm.msg.value,
    room: msgForm.id,
  };
  console.log(message);
  socket.emit("chatmessage", message);
  console.log("submit from msgform", msgForm.msg.value);
  msgForm.msg.value = "";
});

function appendMessages(message) {
  const html = `<div id="${currentUser.username}">${message.msg}</div><div id="${currentUser.username}">${message.sent}</div>`;
  messages.innerHTML += html;
}
const inviteButton = document.querySelector(".invite-button");
inviteButton.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("joinRoom");
  socket.emit("get-invite-code", currentUser);
});

socket.on("response", (inviteCode) => {
  msgForm.id = inviteCode;
  alert("INVITE CODE:" + inviteCode);
});

const inputBox = document.querySelector(".chat-code-submit");
inputBox.addEventListener("click", (e) => {
  e.preventDefault();
  const inputBox = document.querySelector(".chat-code-input");
  const currentUser = document.querySelector(".user-details").id;
  const roomID = inputBox.value;
  msgForm.id = roomID;
  console.log(roomID);
  // console.log(`line 32: ${roomID}`);
  // //join room (w/username)
  socket.emit("joinRoom", roomID, currentUser);
  // //clear the chat input box, and focus on the box after button click
  inputBox.value = "";
  // inputBox.focus();
});

socket.on("hello", (data) => {
  messages.innerHTML = "joined room with " + data;
});
socket.on("hello-contact", (data) => {
  messages.innerHTML = "joined room with " + data;
});
socket.on("goodbye", (data) => {
  messages.innerHTML = `User ${data} has left room`;
});
socket.on('refresh-page',()=>{
  window.location.reload();
})

const contactBoxes = document.querySelectorAll(".hidden-roomId");
for (let contactBox of contactBoxes) {
  contactBox.addEventListener("click", (e) => {
    let chatID = e.target.id;
    const targetUser = document.getElementById(chatID).innerText;
    msgForm.id = chatID;
    socket.emit("leave-room", chatID, targetUser);
    socket.emit("get-target-user-info", targetUser);
    socket.emit("joinRoom-contact", chatID, targetUser);
  });
}
const contactPic = document.querySelector(".contact-image-container > img");
const contactName = document.querySelector(".contact-name");
const contactEmail = document.querySelector(".contact-email");
socket.on("target-user-info", (targetInfo) => {
  contactPic.src = targetInfo.pic;
  contactName.innerHTML = targetInfo.username;
  contactEmail.innerHTML = targetInfo.email;
});
