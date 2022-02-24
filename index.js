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
const moment = require("moment");
//DB MODEL
const { MongoClient, ServerApiVersion } = require("mongodb");
const res = require("express/lib/response");
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
  console.log(`socket.id ${socket.id}`);
  socket.emit("socketId", socket.id);

  socket.emit("welcome");

  socket.on("disconnect", () => {
    socket.disconnect(socket.id);
    console.log("after disconnect");
    socket.emit("disconnected", "User has left room");
  });

  socket.on("chatmessage", (messageArray) => {
    async function findRoomID() {
      const roomID = await Room.find(
        { roomName: messageArray.room },
        "_id"
      ).exec();
      messageArray.room = roomID[0];
      try {
        const updateMessage = new Chat(messageArray);
        // console.log(updateMessage._id);
        const newMessage = await updateMessage.save();
        const senderUsername = await Chat.find({
          _id: newMessage._id,
        }).populate("sender");
        const sender = senderUsername[0].sender;
        console.log(sender.username);
        io.emit(
          "message",
          messageArray,
          moment().format("h:mm a"),
          newMessage._id,
          sender.username
        );
      } catch (error) {
        console.log(error);
      }
    }
    findRoomID();
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

  socket.on("joinRoomDB", (roomID, currentUser) => {
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
    socket.emit("refresh-page");
    // this event to everyone in the room.
    // io.sockets.in(roomID).emit("hello", "hello");
  });

  //no page refresh needed on joining room from invite button
  socket.on("joinRoomInvite", (roomID, currentUser) => {
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
  });

  socket.on("joinRoom-contact", (roomID, targetUser) => {
    socket.join(roomID);
    console.log("chat ID: " + roomID);
    async function getChatHistory(roomID) {
      try {
        const conversations = await axios.get(
          `http://localhost:3000/conversations/${roomID}`
        );
        console.log(conversations.data);
        io.sockets.in(roomID).emit("output-messages", conversations.data);
        return conversations.data;
      } catch (error) {
        console.log(error);
      }
    }
    getChatHistory(roomID);
    //Send this event to everyone in the room.
    io.sockets.in(roomID).emit("hello", targetUser);
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

  //deletes message from the database
  socket.on("delete-message", (messageIdentifier) => {
    console.log(`messageIdentifier is ${messageIdentifier}`);
    axios
      .post("http://localhost:3000/deleteMessage", {
        messageIdentifier: messageIdentifier,
      })
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

app.use("/", router);
app.use("/", userRoutes);
app.use("/", roomRoutes);

server.listen(port, () => {
  console.log(`listening at port ${port}`);
});
