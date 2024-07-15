const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: {
      type: Array,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    }
  }
);

const Order =  mongoose.model("Order", orderSchema);

module.exports = Order;