const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const pics = "./images";
const randNum = Math.floor(Math.random() * 9) + 1;
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pic: {
      type: String,
      required: true,
      default: `${pics}/${randNum}.jpg`,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
