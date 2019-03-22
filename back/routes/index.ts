import express = require("express");

const router = express.Router();

router.get("/", (request, response) => {
    response.send({
        route: "root",
    });
});

export {router};
