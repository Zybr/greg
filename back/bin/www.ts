import http = require("http");
import io = require("socket.io");
import { app } from "../app";
import { ErrorProcessor } from "../src/core/ErrorProcessor";
import { SocketDispatcher } from "../src/crawl/api/SocketDispatcher";

/** Create serve */
app.set("port", parseInt(process.env.PORT || "3000", 10)); // Define port
const server = http.createServer(app); // Create server
server.listen(app.get("port"));

/** Handle errors */
server.on("error", ErrorProcessor.handleServerError);
process.on("uncaughtException", ErrorProcessor.handleServerError);

/** Create socket server */
const socketServer = io(server);
const socketDispatcher = new SocketDispatcher(socketServer);
socketServer.listen(server);
