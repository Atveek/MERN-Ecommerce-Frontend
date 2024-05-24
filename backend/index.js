const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./routes/Product");
const Category = require("./routes/Category");
const Brand = require("./routes/Brand");
const User = require("./routes/User");
const Auth = require("./routes/Auth");
const Cart = require("./routes/Cart");
const Order = require("./routes/Order");

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1/eKart")
  .then(() => {
    console.log("database connect successfully");
  })
  .catch((err) => {
    console.log(err);
  });

server.use("/products", Product);
server.use("/category", Category);
server.use("/brands", Brand);
server.use("/user", User);
server.use("/auth", Auth);
server.use("/cart", Cart);
server.use("/orders", Order);

server.listen(8080, () => {
  console.log("server run on 8080");
});
