/* ===== Dependencies and Modules ===== */
require("dotenv").config()

import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import cors from "cors";

require("./utils/passport.js");

import userRoutes from "./routes/users.js"
import productRoutes from "./routes/products.js"
import orderRoutes from "./routes/orders.js"
import cartRoutes from "./routes/carts.js"

/* ===== Environment Setup ===== */
const port = 4000;

/* ===== Server Setup ===== */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors());

/* ===== Google Login ===== */
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}));
// Initializes the passport package when the application runs
app.use(passport.initialize());
// Creates a session using the passport package
app.use(passport.session());

/* ===== Database Connection ===== */
// Connect to our MongoDB database
mongoose.connect("mongodb+srv://admin:admin123@b337.czppwrz.mongodb.net/ecommerce-API?retryWrites=true&w=majority",
		{
			useNewUrlParser : true,
			useUnifiedTopology : true
		}
);
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

/* ===== Backend Routes ===== */
// http://localhost:4000/
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/carts", cartRoutes);

/* ===== Server Gateway Response ===== */
if(require.main === module){
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${ process.env.PORT || port }`)
	})
}

module.exports = { app, mongoose };