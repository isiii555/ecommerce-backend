const express = require("express");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const route = express.Router();

route.use(express.json());

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const result = await bcrypt.compare(password, existingUser.passwordHash);
      if (result) {
        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);
        return res.status(201).json({ accessToken, refreshToken });
      }
      return res.status(401).send("Wrong password");
    }
    return res.status(401).send("Wrong email");
  } catch (err) {
    res.status(500).json(err);
  }
});

route.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let result = await User.findOne({ email });
    if (!result) {
      const passwordHash = await bcrypt.hash(password, 10);
      let newUser = new User({
        username,
        email,
        passwordHash,
      });
      newUser = await newUser.save();
      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);
      return res.status(201).json({ accessToken, refreshToken });
    }
    return res.status(409).send("User already exist");
  } catch (err) {
    res.status(500).json(err);
  }
});

route.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    const result = verifyRefreshToken(refreshToken);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    let user = result.data;
    let newAccessToken = generateAccessToken(user);
    let newRefreshToken = generateRefreshToken(user);
    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
