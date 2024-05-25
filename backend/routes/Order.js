const express = require("express");
const {
  fetchOrderByUser,
  createOrder,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
} = require("../controllers/Order");

const router = express.Router();

router
  .get("/user/:user", fetchOrderByUser)
  .post("/", createOrder)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);

module.exports = router;
