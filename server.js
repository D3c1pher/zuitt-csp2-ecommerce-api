/* ===== Dependencies and Modules ===== */
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error.js");

/* ===== Routes ===== */
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

/* ===== Server Setup ===== */
const app = express();

/* ===== Middlewares ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* ===== Backend Routes ===== */
// http://localhost:4000/
app.use("/b3/users", userRoutes);
app.use("/b3/products", productRoutes);
app.use("/b3/cart", cartRoutes);
app.use("/b3/orders", orderRoutes);

/*  ===== Error Handling Middleware ===== */
app.use(errorHandler);

module.exports = { app };
