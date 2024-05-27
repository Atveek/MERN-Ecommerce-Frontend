const { User } = require("../models/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/Common");
const SECRET_KEY = "SECRET_KEY";
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const response = await user.save();

        req.login(sanitizeUser(response), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign({ foo: "bar" }, SECRET_KEY);
            res.status(201).json(token);
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  res.json(req.user);
};

exports.checkUser = async (req, res) => {
  res.json({ status: "success", user: req.user });
};
