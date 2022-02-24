const express = require("express"),
  app = express(),
  router = express.Router(),
  buildUserMessagesObject = require("../../modules/userMessages.js");
const passport = require("passport");
const User = require("../../models/user");
const Rooms = require("../../models/room");
const axios = require("axios");
async function getConvo(userNum) {
  try {
    const conversations = await axios.get(
      `http://localhost:3000/chats/${userNum}`
    );
    console.log(conversations.data);
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
//check username and password (hard coded for now, this will happen with a database query below)
const usernameA = "Matthew";
const passwordA = 1234;
const usernameB = "John";
const passwordB = 1234;

//ERROR HANDLING
app.use((err, req, res, next) => {
  res.send("something went wrong");
});

module.exports = router;
