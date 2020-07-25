import cookieParser = require("cookie-parser");
import {Express} from "express";
import express = require("express");
import createError = require("http-errors");
import logger = require("morgan");
import path = require("path");
import {router as indexRouter} from "./routes/index";
import {router as searchRouter} from "./routes/search";

const app: Express = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "dist")));

app.use("/", indexRouter);
app.use("/search", searchRouter);

// catch 404 and forward to error handler
app.use((request, response, next) => {
    next(createError(404));
});

// error handler
app.use((error, request, response, next) => {
    // set locals, only providing error in development
    response.locals.message = error.message;
    response.locals.error = request.app.get("env") === "development" ? error : {};

    // render the error page
    response.status(error.status || 500);
    response.render("core/error");
});

export {app};
