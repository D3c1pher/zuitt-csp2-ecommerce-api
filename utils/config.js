/* ===== Dependencies and Modules ===== */
require("dotenv").config();

/* ===== Environment Setup ===== */
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 4003,
    database: process.env.DB_NAME || "ecommerce-API",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "admin123"
};

const jwtConfig = {
    secret: process.env.JWT_SECRET || "EcommerceAPI",
    expiration: process.env.JWT_EXPIRATION || "1h"
};

const oAuthConfig = {
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:4003/users/google/callback"
}

const mongoURI = process.env.MONGODB_URI || `mongodb+srv://${user}:${password}@capstone-2.s3zi0zl.mongodb.net/${database}?retryWrites=true&w=majority`

module.exports = { mongoURI, dbConfig, jwtConfig, oAuthConfig };