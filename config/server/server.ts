#!/usr/bin/env node

/**
 * Module dependencies.
 */
import debugMod = require("debug");
import {Express} from "express";
import express = require("express");
import http = require("http");
import createError = require("http-errors");
import {Colorizer} from "../../src/core/Colorizer";
import {router as catalogRouter} from "./routes/catalog";

const debug = debugMod("test:server");
Colorizer.color();

// import {app} from "../../app";

// // APP

const app: Express = express();
app
    .set("view engine", "pug")
    .use("/test", catalogRouter)
    .use((req, res, next) => { // Handle "Not found".
        next(createError(404));
    })
    .use((err, req, res, next) => {// Handle errors.
        // render the error page
        res.status(err.status || 500);
        res.render("error");
    });

// import path = require("path");
// import cookieParser = require("cookie-parser");
// import logger = require("morgan");
//
// const app: Express = express();
// import {router as rootRouter} from "../../routes/index";
// import {router as testRouter} from "../../routes/test";
//
// // view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");
//
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
//
// app.use("/", rootRouter);
// app.use("/test", testRouter);
//
// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//     next(createError(404));
// });
//
// // error handler
// app.use((err, req, res, next) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
// });

// Server

/**
 * Get port from environment and store in Express.
 */

const port: string | null = normalizePort(process.env.PORT || "3000");
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
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const portNumber = parseInt(val, 10);

    if (isNaN(portNumber)) {
        // named pipe
        return val;
    }

    if (portNumber >= 0) {
        // port number
        return portNumber;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
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

