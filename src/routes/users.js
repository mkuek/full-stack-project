const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);
    console.log(`${registeredUser} success`);
  } catch (e) {
    console.log(e.message);
    res.send(e.message);
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    console.log("login success");
    console.log(req.user.username);
    req.flash("success", "Successfully logged in");
    req.flash("error", "Incorrect username or password");
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "logged out");
  res.redirect("/");
});

module.exports = router;
