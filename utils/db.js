/* ===== Dependencies and Modules ===== */
const mongoose = require("mongoose");
const { mongoURI } = require("./config.js");

/* ===== Database Connection ===== */
const connect = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas: ", err);
        throw err;
    }
};
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

module.exports = { connect };