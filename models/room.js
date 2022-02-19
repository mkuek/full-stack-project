const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const { v4: uuidV4 } = require("uuid");

const RoomSchema = new Schema(
  {
    roomName: {
      type: String,
      default: uuidV4(),
    },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Chat" },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

RoomSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Room", RoomSchema);
