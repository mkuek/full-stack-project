//login to my dashboard (gets my username and room from the search bar)
//login page must (must enter my username and pw, gives me a unique room)
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
// console.log(username, room);
// console.log(room);

const socket = io();

//userID obtained from rendered dashboard home page
// const userID = document.querySelector(".id");
const username = document.querySelector(".name > span").innerHTML;
console.log(username);

//input box for pasting a roomID shared with you
const newChat = document.querySelector(".chat-code-input");
newChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputBox = document.querySelector(".chat-code-input > input");
  const roomID = inputBox.value;
  console.log(roomID);
  //join room (w/username)
  socket.emit("joinRoom", { username, roomID });
  //calls function to write username and roomID to the "active chat" side-bar;
  writeActiveChats(username, roomID);
  //clear the chat input box, and focus on the box after button click
  inputBox.value = "";
  inputBox.focus();
});

//writes new chats in the sidebar, sends info to the server about the created room.
function writeActiveChats(username, roomID) {
  const activeChats = document.querySelector(".active-chats");
  const newChat = document.createElement("div");
  console.log(username);
  newChat.textContent = `${username}`;
  activeChats.appendChild(newChat);
  socket.emit("new-room-created", { username, roomID });
}

//input box for sending a message (to those in the the same room)
const messageSubmitButton = document.querySelector(".message-submit-button");
messageSubmitButton.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.querySelector(".message-input");
  const msg = messageInput.value;
  console.log(msg);
  //send message to the server
  socket.emit("chatMessage", msg);
  //clear the chat input box, and focus on the box after button click
  inputBox.value = "";
  inputBox.focus();
});

//generate a random invite room Id to email to someone
const inviteButton = document.querySelector(".invite-button");
inviteButton.addEventListener("click", () => {
  socket.emit("get-invite-code", username);
});

//on receiving a formatted message, calls function to output message to the browser chat window
socket.on("message", (formattedMessage) => {
  console.log(formattedMessage);
  //writes messages received from the server in the clients browser
  outputMessage(formattedMessage);
  //autoscrolls messages down
  const chatWindow = document.querySelector(".chat-window");
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

//outputs message to the chat window
function outputMessage(message) {
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
  document.querySelector(".chat-window").appendChild(div);
}
