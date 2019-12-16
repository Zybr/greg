import http = require("http");
import io = require("socket.io");
import {app} from "../app";
import {eventNames as en} from "../src/crawl/api/event-names";
import GoogleDispatcher from "./socket-dispatchers/GoogleDispatcher";

const port: number | string = process.env.PORT || "3000";
app.set("port", port);
const server = http.createServer(app);
const socketServer = io(server);

server.listen(port);
socketServer.listen(server);
socketServer.on(en.socket.connection, (client) => new GoogleDispatcher(client).connect());
