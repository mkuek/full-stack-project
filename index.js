const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
const routes = require("./src/routes/router");

app.use("/chat", routes);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
