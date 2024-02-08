/* ===== Dependencies and Modules ===== */
require("dotenv").config();

/* ===== Environment Setup ===== */
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://admin:admin123@capstone-2.s3zi0zl.mongodb.net/ecommerce-API?retryWrites=true&w=majority"
module.exports = { port, mongoURI };