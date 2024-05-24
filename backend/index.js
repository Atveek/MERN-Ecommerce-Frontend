const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./routes/Product");
const Category = require("./routes/Category");
const Brand = require("./routes/Brand");

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
server.use("/brand", Brand);

server.listen(8080, () => {
  console.log("server run on 8080");
});
