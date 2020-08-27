import express from "express";
import { default as fs } from "fs";

const router = express.Router();

router.get("/", (req, res, next) => {
    res.send({
        version: JSON.parse(fs.readFileSync("./package.json", "utf8")).version,
    });
});

export default router;
