const config = {
  host: "localhost",
  port: 5432,
  database: "chat_app_database",
  user: "postgres",
};
const pgp = require("pg-promise")();
const db = pgp(config);
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//CREATE ROOM
app.post("/chat", (req, res) => {
  const { roomName, userID, date_created } = req.body;
  db.none(
    "INSERT INTO rooms (userID, date_created,roomName) VALUES ($1, $2, $3)",
    [userID, date_created, roomName]
  ).then(() => {
    console.log(`Chatroom ${roomName} was created`);
    res.send("room created");
  });
});
//CREATE USER
app.post("/user", (req, res) => {
  const { userID, userName } = req.body;
  db.none("INSERT INTO users (userID, userName) VALUES ($1, $2)", [
    userID,
    userName,
  ]).then(() => {
    console.log(`User ${userName} was created`);
    res.send("User created");
  });
});

//GET ALL ROOMS
app.get("/chat", (req, res) => {
  db.any("SELECT * FROM rooms ORDER BY roomName")
    .then((results) => {
      // res.render("home", { results });
      res.send("it worked");
    })
    .catch((e) => {
      console.log(e);
    });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
