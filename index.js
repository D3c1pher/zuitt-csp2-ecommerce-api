/* ===== Dependencies and Modules ===== */
require("dotenv").config()

import express from "express";
import mongoose from "mongoose";
// import passport from "passport";
// import session from "express-session";
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
// app.use(session({
// 	secret: process.env.clientSecret,
// 	resave: false,
// 	saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

/* ===== Database Connection ===== */
// Connect to our MongoDB database
const connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin123@capstone-2.s3zi0zl.mongodb.net/ecommerce-API?retryWrites=true&w=majority",
			{
				useNewUrlParser : true,
				useUnifiedTopology : true
			}
		);
    } catch (error) {
		throw error;
    }
};

mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

/* ===== Backend Routes ===== */
// http://localhost:4000/
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/carts", cartRoutes);

/*  ===== Process Errors ===== */
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

/* ===== Server Gateway Response ===== */
if(require.main === module){
	app.listen(process.env.PORT || port, () => {
		connect()
		console.log(`API is now online on port ${ process.env.PORT || port }`)
	})
}

module.exports = { app, mongoose };