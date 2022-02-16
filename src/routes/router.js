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
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//GET ROOM NAMES
router.get("/", async (req, res, next) => {
  try {
    //db call stored as a variable then sent out to render page
    const results = await db.any("SELECT * FROM rooms ORDER BY roomName");
    res.send(results);
  } catch (error) {
    next(error);
  }
});

//CREATE ROOM
router.post("/", async (req, res, next) => {
  try {
    //post to database
    console.log(req.body);
    const { roomName, userID, created = "now()" } = req.body;
    const results = await db.none(
      "INSERT INTO rooms (userID, created,roomName) VALUES ($1, $2, $3)",
      [userID, created, roomName]
    );
    res.send(`Chatroom ${roomName} was created`);
  } catch (error) {
    next(error);
  }
});

//DELETE ROOM
router.post("/:roomName", async (req, res, next) => {
  try {
    const { roomName } = req.params;
    const results = await db.none(
      "DELETE FROM rooms WHERE roomName=($1)",
      roomName
    );
    res.send(`Chatroom ${roomName} was deleted`);
  } catch (error) {
    next(error);
  }
});

//NOT COMPLETE OLD CODE
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

//ERROR HANDLING
app.use((err, req, res, next) => {
  res.send("something went wrong");
});

module.exports = router;
