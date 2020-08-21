import mongoose = require("mongoose");
import config = require("../../resource/config/db");

/** Configure database connection */
mongoose.connect(config.url, config.options);
const DB = mongoose.connection;
DB.on("error", (error: Error) => console.error("DB. Connection error. ", error.message));
// DB.once("open", () => console.info("DB. Connection established."));

export default mongoose;
