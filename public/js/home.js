const socket = io("http://localhost:3000/");
const messages = document.querySelector(".chat-window");
const msgForm = document.querySelector(".chat-input");
const currentUser = document.querySelector(".user-details").id;
const chatHeader = document.querySelector(".chat-header");

//stores users socketId
let userSocketId = "";
socket.on("socketId", (socketId) => {
  userSocketId = socketId;
});

//disconnects user socket on logout button click
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", (e) => {
  console.log(`socketId: ${userSocketId}`);
  socket.emit("disconnect", userSocketId);
  socket.disconnect(userSocketId);
  socket.on("disconnect", function () {
    console.log("disconnected from socket client side!!!!");
  });
});

//opens paste invite code dropdown menu
const chatBubbleFlex = document.querySelector(".chat-bubble-flex");
chatBubbleFlex.addEventListener("click", (e) => {
  const codeSubmitDropdown = document.querySelector(".code-submit-dropdown");
  codeSubmitDropdown.setAttribute("id", "visible");
  console.log("click");
});

//deletes message from db
const body = document.querySelector("body");
body.addEventListener("click", (e) => {
  if (e.target.classList.contains("close")) {
    const messageIdentifier = e.target.id;
    console.log(messageIdentifier);
    socket.emit("delete-message", messageIdentifier);
    console.log("click");
    const messageToDelete = document.getElementById(messageIdentifier);
    messageToDelete.remove();
  }
});

//appends messages to the chat-window and scrolls down
socket.on("message", (data, time, chatID, username) => {
  appendMessages(data, time, chatID, username);
  messages.scrollTop = messages.scrollHeight;
});

//displays stored messages in chat-window
socket.on("output-messages", (data) => {
  messages.innerHTML = "";
  if (data.length) {
    data.forEach((message) => {
      appendMessages(message, message.sent, message.chatID, message.username);
    });
  }
  messages.scrollTop = messages.scrollHeight;
});

// socket.on("disconnected", (data) => {
//   appendMessages(data);
// });

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
function appendMessages(message, time, chatID, username) {
  message.sender == currentUser
    ? (sender = "current-user")
    : (sender = "another-user");

  !message.sent ? (sent = time) : (sent = message.sent);
  const html = `<div class="message ${sender}" id="${chatID}">
  <p class="message-username" >
    ${username}
    <button class="close" id="${chatID}"></button>
  </p>
  <p class="message-text">${message.msg}</p>
  <p class="message-time">${sent}</p>
</div>`;
  messages.innerHTML += html;
}

//invite button
const inviteButton = document.querySelector(".invite-button");
inviteButton.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("get-invite-code", currentUser);
  socket.emit("joinRoomInvite");
});

//receive invite code generated on server and copy it to the clipboard
socket.on("response", (inviteCode) => {
  console.log("response has been sent");
  console.log(`invite code received ${inviteCode}`);
  msgForm.id = inviteCode;
  // alert("INVITE CODE:" + inviteCode);
  copyToClipboard(inviteCode);
});

// copies code to the users clipboard (execCommand is technically deprecated)
function copyToClipboard(inviteCode) {
  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("value", inviteCode);
  document.body.appendChild(hiddenInput);
  hiddenInput.select();
  document.execCommand("copy");
  document.body.removeChild(hiddenInput);
  inviteButton.setAttribute("id", "copied");
  const inviteButtonHeadline = document.querySelector(".copy-code-headline");
  inviteButtonHeadline.textContent = "Invite code copied";
  setTimeout(function () {
    inviteButton.removeAttribute("id");
    inviteButtonHeadline.textContent = "Copy invite code";
  }, 3000);
}

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
socket.on("hello", () => {
  const enteredChatDot = document.querySelector(".entered-chat-dot");
  enteredChatDot.setAttribute("id", "on");
});

socket.on("welcome", () => {
  const user = document.querySelector(".users-name");
  chatHeader.innerHTML = `<div class = "chat-header-div"><span>Hi ${user.textContent}!</span> Invite someone to chat by clicking the link below.<img src = "./images/blue_arrow.png"/></div>`;
  setTimeout(function () {
    chatHeader.remove();
  }, 7500);
});

socket.on("goodbye", (data) => {
  const enteredChatDot = document.querySelector(".entered-chat-dot");
  enteredChatDot.removeAttribute("id");
});

socket.on("refresh-page", () => {
  window.location.reload();
});

//clicking contacts
let selectedContact = "";
const contactBoxes = document.querySelectorAll(".hidden-roomId");
for (let contactBox of contactBoxes) {
  contactBox.addEventListener("click", (e) => {
    let chatID = e.target.id;
    if (selectedContact == chatID) {
      selectedContact = chatID;
    } else {
      selectedContact = chatID;
      const targetUser = document.getElementById(chatID).innerText;
      msgForm.id = chatID;
      socket.emit("leave-room", chatID, targetUser);
      socket.emit("get-target-user-info", targetUser);
      socket.emit("joinRoom-contact", chatID, targetUser);
    }
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
