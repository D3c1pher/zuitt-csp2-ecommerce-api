/* ===== Dependencies and Modules ===== */
const { app } = require("./server.js");
const { connect } = require("./utils/db.js");
const { port } = require("./utils/config.js");

/* ===== Server Gateway Response ===== */
if (require.main === module) {
    connect().then(() => {
        app.listen(port, () => {
            console.log(`API is now online on port ${port}`);
        });
    }).catch(err => {
        console.error("Error in starting server:", err);
    });
};