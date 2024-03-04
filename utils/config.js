/* ===== Dependencies and Modules ===== */
require("dotenv").config();

/* ===== Environment Setup ===== */
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 4003,
    database: process.env.DB_NAME || "ecommerce-store",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "admin123"
};

const jwtConfig = {
    secret: process.env.JWT_SECRET || "EcommerceStore",
    expiration: process.env.JWT_EXPIRATION || "1h"
};

const mongoURI = process.env.MONGODB_URI || `mongodb+srv://${dbConfig.user}:${dbConfig.password}@capstone-2.s3zi0zl.mongodb.net/${dbConfig.database}?retryWrites=true&w=majority&appName=Capstone-2`

module.exports = { mongoURI, dbConfig, jwtConfig };