const express = require("express");
const {
  fetchOrderByUser,
  createOrder,
  deleteOrder,
  updateOrder,
} = require("../controllers/Order");

const router = express.Router();

router
  .get("/", fetchOrderByUser)
  .post("/", createOrder)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);

module.exports = router;
