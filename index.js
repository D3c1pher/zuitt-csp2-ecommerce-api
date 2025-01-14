/* ===== Dependencies and Modules ===== */
const { app } = require("./server.js");
const { connect } = require("./utils/db.js");
const { dbConfig } = require("./utils/config.js");

/* ===== Server Gateway Response ===== */
if (require.main === module) {
    connect().then(() => {
        app.listen(dbConfig.port, () => {
            console.log(`API is now online at ${dbConfig.host}:${dbConfig.port}\n`);
        });
    }).catch(err => {
        console.error("Error in starting server:", err);
    });
};
