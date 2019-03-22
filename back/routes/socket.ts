import express = require("express");

const router = express.Router();

router
    .get("/", (request, response) => response.render("socket/index"));

export {router};
