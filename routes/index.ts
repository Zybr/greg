// const express = require("express");
import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
    res.send({
        route: "root",
    });
});

export {router};
