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
const path = require("path");

const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const { User } = require("./model/User");
const {
  isAuth,
  sanitizeUser,
  cookieExtractor,
} = require("./services/authservecies");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.ENDPOINT_URL;
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

// Middlewares
server.use((req, res, next) => {
  if (req.originalUrl.startsWith("/webhook")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});
server.use(express.static(path.resolve(__dirname, "build")));
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

// Configure Passport strategies
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          (err, hashedPassword) => {
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
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    { jwtFromRequest: cookieExtractor, secretOrKey: SECRET_KEY },
    async (jwt_payload, done) => {
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
    }
  )
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user);
  });
});

// Apply express.json middleware only to non-webhook routes

// Routes
server.use("/products", isAuth(), productsRouter);
server.use("/category", isAuth(), categoriesRouter);
server.use("/brands", isAuth(), brandsRouter);
server.use("/user", isAuth(), usersRouter);
server.use("/auth", authRouter);
server.use("/cart", isAuth(), cartRouter);
server.use("/orders", isAuth(), ordersRouter);

// Payment Intent Endpoint
server.post("/create-payment-intent", async (req, res) => {
  const { items, customerDetails } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1400, // Example static amount
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
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Webhook Endpoint
server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("Webhook event verified:", event);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log("PaymentIntent was successful:", paymentIntentSucceeded);
        // Handle the event here (e.g., update database)
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
  }
);

// Connect to the database and start the server
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("database connected");
}

main().catch((err) => console.log(err));

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.listen(process.env.PORT, () => {
  console.log("server started");
});
