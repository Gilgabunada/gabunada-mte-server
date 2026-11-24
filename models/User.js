const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true
    },
    firstName: {
      type: String,
      required: [true, "Firstname is Required"],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, "Lastname is Required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);