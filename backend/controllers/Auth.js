const { User } = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const response = await user.save();
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: "no such user email" });
    } else if (user.password === req.body.password) {
      res
        .status(201)
        .json({
          id: user.id,
          email: user.email,
          name: user.name,
          addresses: user.addresses,
        
        });
    } else {
      res.status(401).json({ message: "Invalid Credential" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
