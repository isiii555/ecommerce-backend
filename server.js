const cluster = require('cluster');
const os = require('os');
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const basketRoutes = require("./routes/basketRoutes");
require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT;
const con_str = process.env.CON_STR;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
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
  app.use("/api/v1/basket", basketRoutes);

  app.listen(port, () => {
    console.log(`Server started listening @ port ${port}`);
  });
}
