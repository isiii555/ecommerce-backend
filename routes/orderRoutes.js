const express = require("express");
const authenticateAccessToken = require("../middlewares/authenticateAccessToken");
const isAdmin = require("../middlewares/isAdmin");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const route = express.Router();

route.get("/", authenticateAccessToken, async (req, res) => {
  try {
    const { id } = req.body.user;
    const order = await Order.findOne({ user: id });
    if (order) {
      return res.status(200).json(order);
    }
    return res.status(404).send(`ORDER_NOT_FOUND_USER_ID_${id}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.get("/getAll", authenticateAccessToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.post("/", authenticateAccessToken, async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { id } = req.body.user;
    const newOrder = new Order({
      orderItems: [product],
      user: id,
    });

    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

route.put("/:orderId", authenticateAccessToken, async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order || order.user != req.body.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderItems.push(product);
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = route;
