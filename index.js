const express = require("express"),
  app = express(),
  port = 3000;
// const path = require("path");
// const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/css", express.static(__dirname + "/views/css"));
app.use("/js", express.static(__dirname + "/views/js"));

app.set("view engine", "ejs");
app.set("views", "./src/views/");

const router = require("./src/routes/router");
app.use("/", router);

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
