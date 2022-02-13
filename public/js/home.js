//login to my dashboard (gets my username and room from the search bar)
//login page must (must enter my username and pw, gives me a unique room)
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
// console.log(username, room);
// console.log(room);

const socket = io();

//hardcoded right now, this will change
const username = "matthew";
// const roomID = "1c474a76-5fac-48bf-939a-d02d76f9f57f";

//input box for pasting a roomID shared with you
const newChat = document.querySelector(".new-chat-input");
newChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputBox = document.querySelector(".new-chat-input > input");
  const roomID = inputBox.value;
  console.log(roomID);
  //join room (w/username)
  socket.emit("joinRoom", { username, roomID });
  //clear the chat input box, and focus on the box after button click
  inputBox.value = "";
  inputBox.focus();
});

//generate a random invite room Id to email to someone
const inviteButton = document.querySelector(".invite-button");
inviteButton.addEventListener("click", () => {
  socket.emit("get-invite-code", username);
});

//=> => => currently here, or a little below

//on receiving a formatted message, calls function to output message to the browser chat window
socket.on("message", (formattedMessage) => {
  console.log(formattedmMessage);
  //writes messages received from the server in the clients browser
  outputMessage(formattedmMessage);
  //autoscrolls messages down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//outputs message to the chat window
function outputMessage(message) {
  const div = document.createElement("div");
  if (message.username === username) {
    div.classList.add("own-message");
  } else {
    div.classList.add("other-message");
  }
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

module.exports = outputMessage;
