import express = require("express");

const router = express.Router();

router.get("/", (request, response, next) => {
    response.send({
        route: "test",
    });
});

export {router};
