const { Schema, model } = require("mongoose");

const User = new Schema({
  username: String,
  fullname: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  created_at: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
  updated_at: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});

exports.User = model("User", User);
