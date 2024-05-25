const { Order } = require("../models/Order");

exports.fetchOrderByUser = async (req, res) => {
  const { user } = req.params;
  try {
    const cart = await Order.find({ user: user }); // Correct field name from schema
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

exports.fetchAllOrders = async (req, res) => {
  try {
    let query = Order.find({});
    let totalItems = Order.find({ deleted: { $ne: true } });
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
      totalItems = totalItems.sort({ [req.query._sort]: req.query._order });
    }

    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const docs = await query.exec();
    const total = await totalItems.count().exec();
    console.log(total);
    res.set("X-Total-Count", total);
    res.status(201).json(docs);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
