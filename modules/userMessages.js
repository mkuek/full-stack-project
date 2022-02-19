// const User = require("../../models/user");
const Room = require("../models/room");
const express = require("express"),
  app = express(),
  router = express.Router();

const buildUserMessagesObject = (req, res) => {
  const username = req.user;

  // try {
  //   const users=await User.find({})
  // } catch (error) {
  //   console.log(error)
  // }
  //!3b database query which generates this (all users with a certain roomID in an object), this may be two queries then some data manipulation
  //! [ {username: Matthew, guest1: John, roomID: 123},
  //! {username: Matthew, guest1: Tom, roomID: 456},
  //! {username: Matthew, guest1: Bill, guest2: Bill, roomID: 789} ]
  //! dummy data below to be replaced
  return [
    ["hello", 123],
    ["Tom", 456],
    ["Gina", 789],
  ];
};

module.exports = buildUserMessagesObject;
