import cors from "cors";
import { Express } from "express";
import express = require("express");
import httpStatus = require("http-status-codes");
import logger = require("morgan");
import rootRouter from "./routers/index";
import { Responder } from "./src/api/Responder";
import mapRouter from "./src/api/routers/maps";
import resourceRouter from "./src/api/routers/resources";

const app: Express = express();
const responder = new Responder();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use("/", rootRouter);
app.use("/maps", mapRouter);
app.use("/resources", resourceRouter);

// Error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    switch (("Error" !== err.name) ? err.name : err.constructor.name) {
        case "ValidationError":
            responder.sendBadRequest(res, err.message, err.stack.split("\n"));
            break;
        case "NotFoundError":
            responder.sendNotFound(res, err.message, err.stack.split("\n"));
            break;
        default:
            res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
                .send({message: err.message});
    }
});

export { app };
