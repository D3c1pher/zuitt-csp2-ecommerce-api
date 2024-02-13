/* ===== Dependencies and Modules ===== */
require("dotenv").config();

/* ===== Environment Setup ===== */
const mongoURI = process.env.MONGODB_URI || `mongodb+srv://${user}:${password}@capstone-2.s3zi0zl.mongodb.net/${database}?retryWrites=true&w=majority`

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 4000,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const jwtConfig = {
    secret: process.env.JWT_SECRET || "EcommerceAPI",
    expiration: process.env.JWT_EXPIRATION || "1h"
};

const oAuthConfig = {
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/users/google/callback"
}

module.exports = { mongoURI, dbConfig, jwtConfig, oAuthConfig };