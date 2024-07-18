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
    const orders = await Order.find({ user: id });
    return res.status(200).json(orders);
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
    const currentUserId = req.body.user.id;
    const currentUser = await User.findById(currentUserId);
    const newOrder = new Order({
      orderItems: currentUser.basket,
      owner: currentUser.id,
    });
    currentUser.basket = [];
    await currentUser.save();
    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

route.put("/:orderId", authenticateAccessToken, isAdmin, async (req, res) => {
  try {
    const status = await Order.findByIdAndUpdate(req.params.orderId, {
      orderItems: req.body.products,
    });
    status
      ? res.status(200).json({
          message: "ORDER_UPDATED_SUCCESS",
        })
      : res.status(404).json({
          message: `ORDER_NOT_FOUND_${req.params.orderId}`,
        });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

route.put(
  "/:orderId/approveOrder",
  authenticateAccessToken,
  isAdmin,
  async (req, res) => {
    try {
      const status = await Order.findByIdAndUpdate(req.params.orderId, {
        status: "approved",
      });
      status
        ? res.status(200).send(`ORDER_APPROVED_ID_${req.params.orderId}`)
        : res.status(404).send(`ORDER_NOT_FOUND_ID_${req.params.orderId}`);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

route.put(
  "/:orderId/cancelOrder",
  authenticateAccessToken,
  isAdmin,
  async (req, res) => {
    try {
      const status = await Order.findByIdAndUpdate(req.params.orderId, {
        status: "cancelled",
      });
      status
        ? res.status(200).send(`ORDER_APPROVED_ID_${req.params.orderId}`)
        : res.status(404).send(`ORDER_NOT_FOUND_ID_${req.params.orderId}`);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = route;
