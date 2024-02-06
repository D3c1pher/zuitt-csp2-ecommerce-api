/* ===== Dependencies and Modules ===== */
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

require("./utils/passport.js");

const userRoutes = require("./routes/users.js");
const productRoutes = require("./routes/products.js");
const orderRoutes = require("./routes/orders.js");
const cartRoutes = require("./routes/carts.js");

/* ===== Server Setup ===== */
const app = express();
dotenv.config();

/* ===== Environment Setup ===== */
const port = 4000;

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

/* ===== Database Connection ===== */
const connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin123@capstone-2.s3zi0zl.mongodb.net/ecommerce-API?retryWrites=true&w=majority",
			{
				useNewUrlParser : true,
				useUnifiedTopology : true
			}
		);
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas: ", err);
		throw err;
    }
};
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

/* ===== Backend Routes ===== */
// http://localhost:4000/
app.use("/users", userRoutes);
app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);
// app.use("/carts", cartRoutes);

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

/* ===== Server Gateway Response ===== */
if (require.main === module) {
    connect().then(() => {
        app.listen(process.env.PORT || port, () => {
            console.log(`API is now online on port ${process.env.PORT || port}`);
        });
    }).catch(err => {
        console.error("Error starting server:", err);
    });
};

module.exports = { app, mongoose };