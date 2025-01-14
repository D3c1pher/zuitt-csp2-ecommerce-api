/* ===== Dependencies and Modules ===== */
require("dotenv").config();

/* ===== Environment Setup ===== */
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    database: process.env.DB_NAME, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD 
};

const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION 
};

const mongoURI = process.env.MONGODB_URI

module.exports = { mongoURI, dbConfig, jwtConfig };
