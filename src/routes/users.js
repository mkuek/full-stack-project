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
    console.log(e);
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    console.log("login success");
    res.redirect("/");
  }
);

module.exports = router;
