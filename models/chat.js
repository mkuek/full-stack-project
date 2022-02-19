const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const chatSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    msg: { type: String, required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

chatSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Chat", chatSchema);
