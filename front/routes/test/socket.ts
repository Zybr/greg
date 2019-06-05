import express = require("express");

const router = express.Router();

router.get("/", (request, response) => {
    response.render("test/socket/index");
});

export {router};
