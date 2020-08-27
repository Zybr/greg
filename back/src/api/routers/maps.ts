import express = require("express");
import MapController from "../controllers/MapController";

const controller = new MapController();

export default express.Router()
    .get("/", controller.list.bind(controller))
    .get("/:id", controller.get.bind(controller))
    .post("/", controller.create.bind(controller))
    .put("/:id", controller.update.bind(controller))
    .delete("/:id", controller.remove.bind(controller));
