const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const chatSchema = new Schema(
  {
    msgFrom: { type: String, default: "", required: true },
    msgTo: { type: String, default: "", required: true },
    msg: { type: String, default: "", required: true },
    room: { type: String, default: "", required: true },
  },
  { timestamps: true }
);

chatSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Chat", chatSchema);
