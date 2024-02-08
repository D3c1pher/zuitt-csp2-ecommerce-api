/* ===== Dependencies and Modules ===== */
require("dotenv").config();

/* ===== Environment Setup ===== */
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://admin:admin123@capstone-2.s3zi0zl.mongodb.net/ecommerce-API?retryWrites=true&w=majority"

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 4000,
    database: process.env.DB_NAME || "ecommerce-API",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "admin123"
};

const jwtConfig = {
    secret: process.env.JWT_SECRET || "EcommerceAPI",
    expiration: process.env.JWT_EXPIRATION || "1h"
};

module.exports = { mongoURI, dbConfig, jwtConfig };