const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/user");

//!i believe this code is not needed
router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, email, pic } = req.body;
    const user = new User({ username, email, pic });
    const registeredUser = await User.register(user, password, pic);
    console.log(`${registeredUser} success`);
    req.flash("success", "Successfully registered user! Log in below!");
    res.redirect("/login");
  } catch (e) {
    console.log(e.message);
    res.send(e.message);
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    console.log("login success");
    req.flash("success", "Successfully logged in");
    req.flash("error", "Incorrect username or password");
    res.redirect("/");
  }
);

router.get("/user/:username", async (req, res) => {
  const id = req.params.username;
  try {
    let foundUser = await User.find({ username: id });
    res.json(foundUser);
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "logged out");
  res.redirect("/login");
  // socket.disconnect(userInfoForReset.id);
  // console.log("after disconnect");
});

module.exports = router;
