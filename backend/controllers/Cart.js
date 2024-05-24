const { Cart } = require("../models/Cart");

exports.fetchCartByUser = async (req, res) => {
  const { user } = req.query;
  console.log(user);
  try {
    const cart = await Cart.find({ user: user })
      .populate("user") // Correct field name from schema
      .populate("product"); // Correct field name from schema
    console.log(cart);
    res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const cart = new Cart(req.body);
    const response = await cart.save();
    const result = await response.populate("product");
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("product");
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
