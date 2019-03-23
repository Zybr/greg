import express = require("express");

const router = express.Router();

router.get("/", (request, response) => {
    response.render("core/index", {head: "Start page"});
});

export {router};
