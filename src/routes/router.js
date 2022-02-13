const config = {
  host: "localhost",
  port: 5432,
  database: "chat_app_database",
  user: "postgres",
};

const express = require("express"),
  router = express.Router(),
  pgp = require("pg-promise")(),
  db = pgp(config);

let dashboardUsername = "";

router.get("/", async (req, res) => {
  try {
    //query database for the user id( return object with all info about the user to render the home page)
    console.log(dashboardUsername);
    res.render("home", { dashboardUsername: dashboardUsername });
  } catch (error) {
    console.log(error);
  }
  dashboardUsername = "";
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

router.post("/login", async (req, res) => {
  try {
    //if username and password are found (go to unique dashboard(home page) - send over username)
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    if (
      (username == usernameA || username == usernameB) &&
      (password == passwordA || password == passwordB)
    ) {
      //actually want a unique user id assigned here (i.e. dashboardUsername should be userId)
      dashboardUsername = username;
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
