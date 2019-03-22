import {Express} from "express";

import cookieParser = require("cookie-parser");
import express = require("express");
import createError = require("http-errors");
import statusCodes = require("http-status-codes");
import logger = require("morgan");
import path = require("path");

import {router as rootRouter} from "./routes/index";
import {router as socketRouter} from "./routes/socket";
import {router as testRouter} from "./routes/test";

const app: Express = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/", rootRouter);
app.use("/test", testRouter);
app.use("/socket", socketRouter);

// catch 404 and forward to error handler
app.use((request, response, next) => {
    next(createError(statusCodes.NOT_FOUND));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || statusCodes.INTERNAL_SERVER_ERROR);
    res.render("core/error");
});

export {app};
