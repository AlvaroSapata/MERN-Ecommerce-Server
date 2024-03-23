//* ------------------   Models   ------------------ *//
const { Schema, model, default: mongoose } = require("mongoose");

// ℹ️ Schema for creating user model
const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    cartData: {
      type: Object,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
