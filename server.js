/* ===== Dependencies and Modules ===== */
const express = require("express");
const cors = require("cors");

const session = require("express-session");
const passport = require("passport");
require("./utils/passport.js");

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
// app.use(
//     session({
//       secret: process.env.CLIENT_SECRET || "defaultSecret",
//       resave: false,
//       saveUninitialized: false,
//     })
// );
// app.use(passport.initialize());
// app.use(passport.session());

/* ===== Backend Routes ===== */
// http://localhost:4000/
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
// app.use("/orders", orderRoutes);

/*  ===== Error Handling Middleware ===== */
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Internal Server Error";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
});

module.exports = { app };