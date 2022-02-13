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

//ADD TASK
app.post("/chat", (req, res) => {
  roomID = req.body.roomID;
  db.none("INSERT INTO rooms (title) VALUES ($1)", newTaskTitle).then(() => {
    console.log(`Task ${newTaskTitle} was created`);
    res.redirect("/chat");
  });
});

//GET ALL TASKS
app.get("/chat", (req, res) => {
  db.any("SELECT * FROM rooms ORDER BY roomID")
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
