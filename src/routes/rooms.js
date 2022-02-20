const express = require("express");
//   app = express(),
//   router = express.Router(),
//   fetchChats = require("../../controllers/rooms");

// router.route("/rooms").get(fetchChats);
// module.exports = router;

const Room = require("../../models/room");
const User = require("../../models/user");
const router = express.Router();
const app = express();
const { v4: uuidV4 } = require("uuid");

app.use(express.urlencoded({ extended: true }));

router.post("/rooms/:sender", async (req, res) => {
  const id = req.params.sender;
  roomName = req.body.roomName;
  console.log("roomname!!!!!!" + roomName);
  const newRoom = new Room({
    roomName,
    users: [id, id],
  });
  try {
    const saveRoom = await newRoom.save();
    console.log("room created");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/chats/:userID", async (req, res) => {
  const currentUser = req.user;
  console.log(req.params.userID);
  try {
    const conversations = await Room.find()
      .populate("users")
      .then(
        Room.find({
          users: req.params.userID,
        })
      );
    res.send(conversations);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
