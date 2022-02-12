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

router.get("/", async (req, res) => {
  try {
    //db call stored as a variable then sent out to render page
    res.render("home");
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    //post to database
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
