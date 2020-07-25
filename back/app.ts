import cookieParser = require("cookie-parser");
import { Express } from "express";
import express = require("express");
import createError = require("http-errors");
import logger = require("morgan");
import { router as rootRouter } from "./routes/index";
import { router as testRouter } from "./routes/test";

const app: Express = express();

// view engine setup

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/", rootRouter);
app.use("/test", testRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // return error
    res.status(err.status || 500);
    res.send({
        error: err.message,
    });
});

export { app };
