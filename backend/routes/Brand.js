const express = require("express");
const { fetchBrand, createBrand } = require("../controllers/Brand");
const router = express.Router();

router.get("/", fetchBrand).post("/", createBrand);

module.exports = router;
