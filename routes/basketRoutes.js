const express = require("express");
const route = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
const authenticateAccessToken = require("../middlewares/authenticateAccessToken");

route.get("/",authenticateAccessToken, async(req,res) => {
    try {
        const currentUserId = req.body.user.id;
        const currentUser =  await User.findById(currentUserId).populate("basket");
        res.status(200).json(currentUser.basket);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

route.post("/:productId", authenticateAccessToken, async (req, res) => {
  try {
    const productId = req.params.productId;
    const currentUserId = req.body.user.id;
    const product = await Product.findById(productId);
    const user = await User.findById(currentUserId);
    console.log(user);
    if (product) {
      user.basket.push(productId);
      await user.save();
      return res.status(201).json(user);
    }
    res.status(404).send(`PRODUCT_NOT_FOUND_ID_${productId}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.delete("/:productId", authenticateAccessToken, async (req, res) => {
  try {
    const productId = req.params.productId;
    const currentUserId = req.body.user.id;
    const currentUser = await User.findById(currentUserId);
    const productIndex = currentUser.basket.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).send({ message: "Product not found in basket" });
    }
    currentUser.basket.splice(productIndex, 1);
    await currentUser.save();
    res.status(200).send(currentUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
