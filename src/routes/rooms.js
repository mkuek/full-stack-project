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

router.post("/rooms", async (req, res) => {
  const currentUser = req.user;

  const newRoom = new Room({
    users: [req.body.senderID, req.body.receiverID],
  });
  try {
    const saveRoom = await newRoom.save();
    res.send(saveRoom);
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
