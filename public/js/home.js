const socket = io("http://localhost:3000/");
const messages = document.querySelector(".chat-window");
const msgForm = document.querySelector(".chat-input");
const currentUser = document.querySelector(".user-details").id;
//!is this chat header needed, why not just post message in chat-window
const chatHeader = document.querySelector(".chat-header");

//opens paste invite code dropdown menu
const chatBubbleFlex = document.querySelector(".chat-bubble-flex");
chatBubbleFlex.addEventListener("click", (e) => {
  const codeSubmitDropdown = document.querySelector(".code-submit-dropdown");
  codeSubmitDropdown.setAttribute("id", "visible");
  console.log("click");
});

socket.on("message", (data, time) => {
  appendMessages(data, time);
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

//writing to the chat window
function appendMessages(message, time) {
  message.sender == currentUser
    ? (sender = "current-user")
    : (sender = "another-user");

  !message.sent ? (sent = time) : (sent = message.sent);

  const html = `<div class="${sender}" id="${message.sender}"><div >${message.msg}</div><div>${sent}</div></div>`;
  messages.innerHTML += html;
}
const inviteButton = document.querySelector(".invite-button");
inviteButton.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("joinRoomDB");
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
  socket.emit("joinRoomDB", roomID, currentUser);
  // //clear the chat input box, and focus on the box after button click
  inputBox.value = "";
  inputBox.focus();
});

//writing things to the chatHeader and chatWindow
socket.on("hello", (data) => {
  chatHeader.innerHTML = "Chatting with: " + data;
});
socket.on("welcome", (data) => {
  chatHeader.innerHTML = data;
});
socket.on("goodbye", (data) => {
  messages.innerHTML = `User ${data} has left room`;
});
socket.on("refresh-page", () => {
  window.location.reload();
});

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
  contactName.innerHTML = `Contact Name: <span>${targetInfo.username}</span>`;
  contactEmail.innerHTML = `Contact Email: <span>${targetInfo.email}</span>`;
});
