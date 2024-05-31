const express = require("express");
const server = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path = require("path");

const SECRET_KEY = "SECRET_KEY";

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

// middlewares
server.use(express.static(path.join(__dirname, "build")));
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use("/products", isAuth(), productsRouter);
server.use("/category", isAuth(), categoriesRouter);
server.use("/brands", isAuth(), brandsRouter);
server.use("/user", isAuth(), usersRouter);
server.use("/auth", authRouter);
server.use("/cart", isAuth(), cartRouter);
server.use("/orders", isAuth(), ordersRouter);

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "Invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) return done(err);
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          return done(null, { token, role: user.role });
        }
      );
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const stripe = require("stripe")(
  "sk_test_51PLPhKSJmcBUzd6E4frMrSkZfjJgTPEGsG5zvBle5yksPRND7WtckYdXvo7TLMPMLcHVgNSpNUK1arUbr31bQ5sj008u8Q9lCQ"
);

const calculateOrderAmount = (items) => {
  return 1400;
};

server.post("/create-payment-intent", async (req, res) => {
  const { items, customerDetails } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "inr",
      description: "Export transaction for order XYZ",
      shipping: {
        name: customerDetails.name,
        address: {
          line1: customerDetails.address.line1,
          city: customerDetails.address.city,
          state: customerDetails.address.state,
          postal_code: customerDetails.address.postal_code,
          country: customerDetails.address.country,
        },
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const endpointSecret =
  "whsec_fa8bb50f8a8d8f387989f6c88a9a41130e18a14ebd9dec475a8c8ab25b924d06";

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eKart");
  console.log("database connected");
}

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.listen(8080, () => {
  console.log("server started");
});
