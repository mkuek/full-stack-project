const express = require("express"),
  app = express(),
  port = 3000;

//calling the v4 function(renamed as uuidV4) makes unique id
const { v4: uuidV4 } = require("uuid");

//set up socket.io
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./modules/formatMessage");
const userJoinObject = require("./modules/manageUsers");
const router = require("./src/routes/router");
const fetch = require("node-fetch");
const axios = require("axios");

const chatBot = "Chatbot";
//setup socket connection
// io.on("connection", (socket) => {
//   console.log(`connected (server-side) with socketId ${socket.id}`);
//   //get invite code when clicked (also sets up a new room)
//   const inviteCode = uuidV4();
//   async function getCurrentUser() {
//     try {
//       const res = await axios.get("http://localhost:3000/currentuser");
//       console.log(res);
//       return res;
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   getCurrentUser();
//   socket.on("get-invite-code", (username, inviteCode) => {
//     // async function createRoom(userNum, inviteCode) {
//     //   try {
//     //     const resp = await axios.post(
//     //       `http://localhost:3000/rooms/${userNum}`,
//     //       { roomName: inviteCode }
//     //     );
//     //     return resp.data;
//     //   } catch (error) {
//     //     console.log(error);
//     //   }
//     // }
//     // createRoom("620fd991022538b6555934e3", inviteCode);
//     //!add this invite code (roomID) to the user's own (i.e. add roomID to username being passed = will need to pass an id (not a username))
//   });

//   //user object variable
//   let user = {};
//   //join room (gets triggered when url is pasted)
//   socket.on("joinRoom", ({ username, roomID, roomChange }) => {
//     console.log(`line 49, server: ${roomID}`);
//     //!update database with users RoomID (after inputting invite code), then make a post request to ("/) to redirect to home page and re-render sidebar
//     async () => {
//       try {
//         const res = await fetch("http://localhost:3000/", {
//           method: "POST",
//           body: "",
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     // makes user object (w/id, username, room), and joins the selected room
//     user = userJoinObject(socket.id, username, roomID);
//     //this socket joins this particular room

//     console.log(`line 63`);
//     console.log(user);
//     console.log(user.roomID);
//     console.log(user.id);
//     // console.log(socket.rooms);
//     socket.join(user.roomID);
//     console.log(socket.rooms); //confirms that socket is in the room

//     //send user socket.id info to client (to disconnect from a socket when changing rooms)
//     socket.emit("userSocketId", user);
//     //!these messages seem to not be emitting after a room change
//     socket.emit(
//       "message",
//       formatMessage(
//         chatBot,
//         `Hi ${user.username}, welcome! You've entered a chat with ...`
//       ),
//       user.roomID,
//       roomChange
//     );

//     //broadcasting (sends message to all in room except the user connecting) when a user connects
//     socket.broadcast
//       .to(user.roomID)
//       .emit(
//         "message",
//         formatMessage(chatBot, `${user.username} has joined the conversation`)
//       ),
//       user.roomID,
//       roomChange;
//   });

//   //receives chat message, formats it, and sends it to all clients in the same room
//   socket.on("chatMessage", (msg, currentRoom) => {
//     console.log(msg);
//     //!post request - save chat to database
//     console.log(`line 92 chat to room id: ${currentRoom}`); //undefined currently (need to get selected roomID in here)
//     console.log(`line 92 chat to room using username: ${user.username}`);
//     // io.sockets
//     //   .to(currentRoom)
//     //   .emit("message", formatMessage(user.username, msg), currentRoom);
//     io.to(currentRoom).emit(
//       "message",
//       formatMessage(user.username, msg),
//       currentRoom
//     );
//     console.log(msg);
//   });

//   //disconnects the user (socket)
//   socket.on("disconnectSocket", function (userInfoForReset) {
//     // console.log("before disconnect");
//     // socket.disconnect(userInfoForReset.id);
//     // console.log("after disconnect");
//     socket.leave(user.roomID);
//   });

//   //notification (server-side) that user has been disconnected
//   socket.on("disconnect", () => {
//     console.log("socket disconnected - confirmed server side");
//   });

//   // io.sockets.sockets.forEach((socket) => {
//   //   // If given socket id is exist in list of all sockets, kill it
//   //   if (userInfoForReset.id);
//   //   socket.disconnect(true);
//   // });
//   // io.sockets.connected[userInfoForReset.id].disconnect();
//   //io.sockets.sockets[].disconnect();

//   // //removes user from the users array
//   // // userLeave(socket.id);
//   // //10a
//   // io.to(user.room).emit(
//   //   "message",
//   //   formatMessage(chatBot, `${user.username} has left the chat`)
//   // );
//   //});
// });

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use(express.static("./public/"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/js", express.static(__dirname + "/views/js"));
app.use("/images", express.static(__dirname + "/views/images"));

app.set("view engine", "ejs");
app.set("views", "./src/views/");

//LOGIN REQUIREMENTS & DB SETUP
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const userRoutes = require("./src/routes/users");
const roomRoutes = require("./src/routes/rooms");
const User = require("./models/user");
const Chat = require("./models/chat");
const Room = require("./models/room");

//DB MODEL
const { MongoClient, ServerApiVersion } = require("mongodb");
const res = require("express/lib/response");
const { update } = require("./models/chat");
const chat = require("./models/chat");
const { emit } = require("process");
const uri =
  "mongodb+srv://chatApp:chatApp123@cluster0.t7h9m.mongodb.net/chat-app?retryWrites=true&w=majority";
mongoose.connect(uri);

mongoose.connection.on("connected", () => {
  console.log("connected to MongoAtlas");
});

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const res = require("express/lib/response");
// const uri =
//   "mongodb+srv://chatApp:chatApp123@cluster0.t7h9m.mongodb.net/chat-app?retryWrites=true&w=majority";
// mongoose.connect(uri);

// mongoose.connection.on("connected", () => {
//   console.log("connected to MongoAtlas");
// });
// mongoose.connect("mongodb://localhost:27017/chat-app");

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("message", "Hello world");
  socket.on("disconnect", () => {
    socket.emit("disconnected", "User has left room");
    console.log("user disconnected");
  });

  socket.on("chatmessage", (messageArray) => {
    async function findRoomID() {
      const roomID = await Room.find(
        { roomName: messageArray.room },
        "_id"
      ).exec();
      messageArray.room = roomID[0];
      console.log(messageArray);
      try {
        const updateMessage = new Chat(messageArray);
        await updateMessage.save();
      } catch (error) {
        console.log(error);
      }
    }
    findRoomID();
    io.emit("message", messageArray.msg);
  });
  socket.on("get-invite-code", (currentUser) => {
    const inviteCode = uuidV4();
    async function createRoom(userNum, inviteCode) {
      try {
        const resp = await axios.post(
          `http://localhost:3000/rooms/${userNum}`,
          { roomName: inviteCode }
        );
        return resp.data;
      } catch (error) {
        console.log(error);
      }
    }
    createRoom(currentUser, inviteCode);
    socket.emit("response", inviteCode);
  });

  socket.on("joinRoom", (roomID, currentUser) => {
    // socket.join(roomID);
    console.log("socketID IS: " + socket.roomID);
    async function updateRoom(currentUser) {
      try {
        const resp = await axios.post(
          `http://localhost:3000/rooms/update/${currentUser}`,
          { roomName: roomID }
        );
        return resp.data;
      } catch (error) {
        console.log(error);
      }
    }
    updateRoom(currentUser);
    //Send this event to everyone in the room.
    // io.sockets.in(roomID).emit("hello", "hello");
  });

  socket.on("joinRoom-contact", (roomID, targetUser) => {
    socket.join(roomID);
    console.log("chat ID: " + roomID);
    async function getChatHistory(roomID) {
      try {
        const conversations = await axios.get(
          `http://localhost:3000/conversations/${roomID}`
        );
        io.sockets.in(roomID).emit("output-messages", conversations.data);
        return conversations.data;
      } catch (error) {
        console.log(error);
      }
    }
    getChatHistory(roomID);
    socket.emit('refresh-page')
    //Send this event to everyone in the room.
    io.sockets.in(roomID).emit("hello-contact", targetUser);
  });

  socket.on("get-target-user-info", (username) => {
    async function getTargetUser(username) {
      try {
        const targetInfo = await axios.get(
          `http://localhost:3000/user/${username}`
        );
        socket.emit("target-user-info", targetInfo.data[0]);
      } catch (error) {
        console.log(error);
      }
    }
    getTargetUser(username);
  });

  socket.on("leave-room", (chatID, targetUser) => {
    socket.leave(chatID);
    console.log(chatID);
    io.sockets.in(chatID).emit("goodbye", targetUser);
  });
});

app.use("/", router);
app.use("/", userRoutes);
app.use("/", roomRoutes);

server.listen(port, () => {
  console.log(`listening at port ${port}`);
});
