const express = require("express");
const mongoose = require("mongoose");

//   app = express(),
//   router = express.Router(),
//   fetchChats = require("../../controllers/rooms");

// router.route("/rooms").get(fetchChats);
// module.exports = router;

const Room = require("../../models/room");
const User = require("../../models/user");
const Chat = require("../../models/chat");
const router = express.Router();
const app = express();
const { v4: uuidV4 } = require("uuid");

app.use(express.urlencoded({ extended: true }));

router.post("/rooms/:sender", async (req, res) => {
  const id = req.params.sender;
  roomName = req.body.roomName;
  const newRoom = new Room({
    roomName,
    users: [id],
  });
  try {
    const saveRoom = await newRoom.save();
    console.log("room created");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.post("/rooms/update/:receiver", async (req, res) => {
  const id = req.params.receiver;
  roomName = req.body.roomName;
  console.log("roomname!!!!!!" + roomName);
  console.log("ID!!!!!!" + id);
  const newUser = { _id: id };

  try {
    // const saveRoom = await updateDB.save();
    await Room.findOneAndUpdate(
      { roomName: roomName },

      { $push: { users: [id] } }
    );

    console.log("room updated");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/chats/:userID", async (req, res) => {
  const currentUser = req.user;
  console.log(req.params.userID);
  try {
    const convo = await Room.find()
      .populate("users")
      let conversations = [];
    for (let i = 0; i < convo.length; i++) {
      if (convo[i].users[i]._id.toString() == req.params.userID) {
        conversations.push(convo[i]);
      } else {
      }
    }
    const rooms = await Room.find({ users: req.params.userID });
    res.send({ conversations, rooms });
  } catch (error) {
    console.log(error);
  }
});

router.get("/conversations/:id", async (req, res) => {
  const conversationID = req.params.id;
  try {
    const conversations = await Chat.find().populate("room");
    let found = [];
    for (let i = 0; i < conversations.length; i++) {
      console.log(conversations);
      if (conversations[i].room.roomName == conversationID) {
        found.push(conversations[i].msg);
      } else {
      }
    }
    res.json(found);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
