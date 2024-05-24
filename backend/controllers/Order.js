const { Cart } = require("../models/Cart");
const { Order } = require("../models/Order");

exports.fetchOrderByUser = async (req, res) => {
  const { user } = req.query;
  console.log(user);
  try {
    const cart = await Order.find({ user: user })
      .populate("user") // Correct field name from schema
      .populate("product"); // Correct field name from schema
    console.log(cart);
    res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const response = await order.save();
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Order.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
