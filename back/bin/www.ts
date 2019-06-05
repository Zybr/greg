import debugMod = require("debug");
import http = require("http");
import io = require("socket.io");
import {app} from "../app";
import {Colorizer} from "../src/core/Colorizer";
import {SocketDispatcher} from "../src/crawl/api/SocketDispatcher";

const debug = debugMod("server");
Colorizer.color();

/**
 * Get port from environment and store in Express.
 */

const port: number | string = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Listen connection by socket.
 */
const socketServer = io(server);
const socketDispatcher = new SocketDispatcher(socketServer);
socketServer.listen(server);

/**
 * Normalize a port into a number.
 */
function normalizePort(val: string): number {
    return parseInt(val, 10);
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            /** @var {NodeJS.Process} process */
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    debug("Listening on " + bind);
}
