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

//generate a random invite number to email to someone
const inviteButton = document.querySelector(".invite-button");
inviteButton.addEventListener("click", () => {
  socket.emit("get-invite-code");
});
