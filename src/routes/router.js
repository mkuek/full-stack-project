const express = require("express"),
  app = express(),
  router = express.Router();
const passport = require("passport");
const User = require("../../models/user");
const Rooms = require("../../models/room");
const axios = require("axios");
async function getConvo(userNum) {
  try {
    const conversations = await axios.get(
      `https://chatworm.herokuapp.com/chats/${userNum}`
    );
    return conversations.data;
  } catch (error) {
    console.log(error);
  }
}

//render dashboard (homepage) using user specific data
let userID = "";
router.get("/", async (req, res, next) => {
  try {
    const username = req.user;
    const userInfo = await User.findById(username._id);
    const { conversations, rooms } = await getConvo(username._id);
    res.render("home", { userID, conversations, userInfo, rooms });
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
});

//CREATE ROOM
router.post("/", async (req, res, next) => {
  try {
    res.redirect("/");
    //location where we can post to database
  } catch (error) {
    console.log(error);
  }
});

router.get("/signup", async (req, res) => {
  try {
    //!db call stored as a variable then sent out to render page
    res.render("signup");
  } catch (error) {
    console.log(error);
  }
});

router.get("/currentuser", async (req, res, next) => {
  try {
    const username = req.user;
    res.json(username);
  } catch (error) {
    console.log(error);
  }
});

//ERROR HANDLING
app.use((err, req, res, next) => {
  res.send("something went wrong");
});

module.exports = router;
