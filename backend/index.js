const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const Product = require("./routes/Product");
const Category = require("./routes/Category");
const Brand = require("./routes/Brand");
const UserRoute = require("./routes/User");
const Auth = require("./routes/Auth");
const Cart = require("./routes/Cart");
const Order = require("./routes/Order");
const { User } = require("./models/User");
const { isAuth, sanitizeUser } = require("./services/Common");

var opts = {};
const SECRET_KEY = "SECRET_KEY";
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

passport.use(
  "local",
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ email: username }).exec();
      if (!user) {
        done(null, false, { message: "no such user email" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (crypto.timingSafeEqual(user.password, hashedPassword)) {
            done(null, sanitizeUser(user));
          } else {
            done(null, false, { message: "Invalid Credential" });
          }
        }
      );
    } catch (err) {
      // res.status(400).json(err);
      console.log(err);
    }
  })
);
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
    });
  });
});

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log(jwt_payload);
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);

  process.nextTick(function () {
    return cb(null, user);
  });
});

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

mongoose
  .connect("mongodb://127.0.0.1/eKart")
  .then(() => {
    console.log("database connect successfully");
  })
  .catch((err) => {
    console.log(err);
  });

server.use("/products", isAuth(), Product);
server.use("/category", isAuth(), Category);
server.use("/brands", isAuth(), Brand);
server.use("/user", isAuth(), UserRoute);
server.use("/auth", Auth);
server.use("/cart", isAuth(), Cart);
server.use("/orders", isAuth(), Order);

server.listen(8080, () => {
  console.log("server run on 8080");
});
