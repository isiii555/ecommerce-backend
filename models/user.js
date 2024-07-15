const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username field must be filled"],
  },
  email: {
    type: String,
    required: [true, "Email field must be filled"],
    unique: true,
    validate: {
      validator : validator.isEmail,
      message : "Please enter valid email"
    }
  },
  passwordHash: {
    type: String,
    required: [true, "Password field must be filled"],
  },
  role: {
    type : String,
    default: "user",
    enum: ["admin", "user"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
