const express = require("express");
const User = require("../models/user");
const route = express.Router();
const authenticateAccessToken = require("../middlewares/authenticateAccessToken");
const isAdmin = require("../middlewares/isAdmin");


route.get("/", authenticateAccessToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = route;
