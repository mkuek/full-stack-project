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