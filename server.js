const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT;
const con_str = process.env.CON_STR;

mongoose
  .connect(con_str)
  .then(() => {
    console.log("Server connected to mongodb");
  })
  .catch((err) => {
    console.log("Server could not connect to mongodb");
  });

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server started listening @ port ${port}`);
});