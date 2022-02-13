const express = require("express"),
  app = express(),
  port = 3000;
// const path = require("path");
// const bodyParser = require("body-parser");

//calling the v4 function(renamed as uuidV4) gives us a unique url
const { v4: uuidV4 } = require("uuid");

//set up socket.io
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./modules/formatMessage");

const chatBot = "Chatbot";

io.on("connection", (socket) => {
  //confirm websocket connection
  console.log("new websocket connection");

  //get invite code when clicked (also sets up a new room)
  socket.on("get-invite-code", (username) => {
    const inviteCode = uuidV4();
    console.log(inviteCode);
    //joins room that code was generated for
    socket.join(inviteCode);
    //emits greeting message
    socket.emit(
      "message",
      formatMessage(chatBot, `Hi ${username}, welcome to the chat!`)
    );
  });

  //join room (gets triggered when url is pasted)
  socket.on("joinRoom", ({ username, roomID }) => {
    // makes user object (w/id, username, room), and joins the selected room
    const user = userJoinObject(socket.id, username, roomID);
    //this socket joins this particular room
    socket.join(user.roomID);
    socket.emit(
      "message",
      formatMessage(chatBot, `Hi ${username}, welcome to the chat!`)
    );

    //test-> broadcasting (sends message to all in room except the user connecting) when a user connects
    socket.broadcast
      .to(user.roomID)
      .emit(
        "message",
        formatMessage(chatBot, `${username} has joined the chat`)
      );
  });

  socket.on("new-room-created", (username, roomID) => {
    //store this info somewhere
  });

  //receives chat message, formats it, and sends it to all clients in the same room
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    //post request - save chat to database
    io.to(user.roomID).emit("message", formatMessage(user.username, msg));
    console.log(msg);
  });
});

//
//imagine that this is a list of users in the room (not sure about this one yet)
const users = [];

//join user to chat
const userJoinObject = (id, username, roomID) => {
  const user = { id, username, roomID };
  users.push(user);
  return user;
};
//

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("./public/"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/js", express.static(__dirname + "/views/js"));

app.set("view engine", "ejs");
app.set("views", "./src/views/");

const router = require("./src/routes/router");
app.use("/", router);

server.listen(port, () => {
  console.log(`listening at port ${port}`);
});
