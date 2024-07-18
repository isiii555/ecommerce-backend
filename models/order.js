const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: String,
      ref: "Product",
      required: true,
    },
  ],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "cancelled", "approved"],
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
