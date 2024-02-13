/* ===== Dependencies and Modules ===== */
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./middlewares/passport.js");
const { errorHandler } = require("./middlewares/error.js");
const { oAuthConfig } = require("./utils/config.js");

/* ===== Routes ===== */
const userRoutes = require("./routes/users.js");
const productRoutes = require("./routes/products.js");
const orderRoutes = require("./routes/orders.js");
const cartRoutes = require("./routes/carts.js");

/* ===== Server Setup ===== */
const app = express();

/* ===== Middlewares ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* ===== Google Login ===== */
app.use(
    session({
      secret: oAuthConfig.clientSecret || "defaultSecret",
      resave: false,
      saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

/* ===== Backend Routes ===== */
// http://localhost:4000/
app.use("/b3/users", userRoutes);
app.use("/b3/products", productRoutes);
app.use("/b3/cart", cartRoutes);
app.use("/b3/orders", orderRoutes);

/*  ===== Error Handling Middleware ===== */
app.use(errorHandler);

module.exports = { app };