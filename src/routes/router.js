const config = {
  host: "localhost",
  port: 5432,
  database: "chat_app_database",
  user: "postgres",
};

const express = require("express"),
  router = express.Router(),
  pgp = require("pg-promise")(),
  db = pgp(config),
  buildUserMessagesObject = require("../../modules/userMessages.js");

//render dashboard (homepage) using user specific data
let userID = "";
router.get("/", async (req, res) => {
  try {
    console.log(userID);
    //!4query database for the user id( return object with all info about the user (i.e. {id, username, email}, to render the home page)
    //!should be called something like "userInfo" rather than userID
    res.render("home", { userID: userID });
  } catch (error) {
    console.log(error);
  }
  // userID = "";
});

router.post("/", async (req, res) => {
  try {
    //post to database
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", async (req, res) => {
  try {
    //db call stored as a variable then sent out to render page
    res.render("login");
  } catch (error) {
    console.log(error);
  }
});

//check username and password (hard coded for now, this will happen with a database query below)
const usernameA = "Matthew";
const passwordA = 1234;
const usernameB = "John";
const passwordB = 1234;
//

//checks username and password against the database and brings user to unique dashboard home page
let userMessagesData = [];
router.post("/login", async (req, res) => {
  try {
    //!1.database query => if username and password are found (go to unique dashboard(home page) - send over username)
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    if (
      (username == usernameA || username == usernameB) &&
      (password == passwordA || password == passwordB)
    ) {
      //!2.want a unique user id assigned here (i.e. should be an actual userId, not username)
      userID = username;
      //!3a.function which queries database to find all rooms which user is a member, and all other users with these rooms
      userMessagesData = buildUserMessagesObject(userID);
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { router, userMessagesData };
