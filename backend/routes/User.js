const express = require("express");
const {
  createUser,
  fetchUserById,
  updateUser,
} = require("../controllers/User");

const router = express.Router();

router
  .get("/:id", fetchUserById)
  .patch("/:id", updateUser);

module.exports = router;
