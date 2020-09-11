import db = require("mongoose");
import config = require("../../resource/config/db");

/** Configure database connection */
db.connect(config.url, config.options);
db.connection.on("error", (error: Error) => console.error("DB. Connection error. ", error.message));

export default db;
