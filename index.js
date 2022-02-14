const express = require("express"),
  app = express(),
  port = 3000;
// const path = require("path");
// const bodyParser = require("body-parser");

//calling the v4 function(renamed as uuidV4) makes unique id
const { v4: uuidV4 } = require("uuid");

//set up socket.io
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./modules/formatMessage");
const manageUsers = require("./modules/manageUsers");
const router = require("./src/routes/router");

const chatBot = "Chatbot";

//setup socket connection
io.on("connection", (socket) => {
  //send object with all users active chat data (to be written to the sidebar)
  console.log(router.userMessagesData);
  socket.emit("write-active-chats", router.userMessagesData);

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
  //user object variable
  let user = {};
  //join room (gets triggered when url is pasted)
  socket.on("joinRoom", ({ username, roomID }) => {
    // makes user object (w/id, username, room), and joins the selected room
    user = manageUsers.userJoinObject(socket.id, username, roomID);
    //this socket joins this particular room
    console.log(user);
    socket.join(user.roomID);
    socket.emit(
      "message",
      formatMessage(chatBot, `Hi ${user.username}, welcome to the chat!`)
    );

    //test-> broadcasting (sends message to all in room except the user connecting) when a user connects
    socket.broadcast
      .to(user.roomID)
      .emit(
        "message",
        formatMessage(chatBot, `${user.username} has joined the chat`)
      );
  });

  //called when active chats name was added to sidebar(should this info go somewhere?)
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("./public/"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/js", express.static(__dirname + "/views/js"));

app.set("view engine", "ejs");
app.set("views", "./src/views/");

app.use("/", router.router);

server.listen(port, () => {
  console.log(`listening at port ${port}`);
});
