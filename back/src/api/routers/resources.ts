import express = require("express");
import ResourceController from "../controllers/ResourceController";

const controller = new ResourceController();

export default express.Router()
    .get("/", controller.list.bind(controller))
    .get("/:id", controller.get.bind(controller))
    .post("/", controller.create.bind(controller))
    .put("/:id", controller.update.bind(controller))
    .delete("/:id", controller.remove.bind(controller));
