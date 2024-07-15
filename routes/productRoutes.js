const express = require("express");
const authenticateAccessToken = require("../middlewares/authenticateAccessToken");
const isAdmin = require("../middlewares/isAdmin");
const Product = require("../models/product");
const route = express.Router();

route.get("/", authenticateAccessToken, isAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.get("/:productId", authenticateAccessToken, async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send(`PRODUCT_NOT_FOUND_ID_${productId}`);
    }
    return res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.post("/", authenticateAccessToken, isAdmin, async (req, res) => {
  try {
    const { title, brand, description, price } = req.body;
    const newProduct = new Product({
      title: title,
      brand: brand,
      description: description,
      price: price,
    });
    const addedProduct = await newProduct.save();
    res.status(201).json(addedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.put("/:id", authenticateAccessToken, isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    let updatedProduct = await Product.findByIdAndUpdate(productId, req.body);
    if (updatedProduct) {
      return res.status(200).json(updatedProduct);
    }
    return res.status(404).send(`PRODUCT_NOT_FOUND_ID_${productId}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.delete("/:id", authenticateAccessToken, isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    let deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) return res.status(200).json(deletedProduct);
    return res.status(404).send(`PRODUCT_NOT_FOUND_ID_${productId}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
