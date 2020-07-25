import express = require("express");

const router = express.Router();

router.get("/", (request, response) => {
    response.redirect("/search");
});

export {router};
