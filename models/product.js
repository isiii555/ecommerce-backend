const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [50, "The length of 'title' must be 50 characters or fewer."],
  },
  brand: {
    type: String,
    required: true,
    maxlength: [20, "The length of 'brand' must be 20 characters or fewer."],
  },
  description: {
    type: String,
    required: true,
    maxlength: [
      200,
      "The length of 'description' must be 200 characters or fewer.",
    ],
  },
  price: {
    type: Number,
    required: true,
  }
});

const Product = mongoose.model("Product",productSchema);

module.exports = Product;
