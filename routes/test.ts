import {should} from "chai";
import express from "express";
import superagent = require("superagent");
import config = require("../config/test.js");
import {Colorizer} from "../src/core/Colorizer";
import {ErrorProcessor} from "../src/core/ErrorProcessor";
import {Parser} from "../src/crawl/parser/Parser";

const router = express.Router();

router.get("/", (req, res, next) => {
    const prepares = [];

    const contentPromise = superagent
        .get(config.resourceBaseUrl + "/google")
        .then((response: any) => {
            // const parser: Parser = new Parser();
            // parser.setContent(response.text);
            // const items = parser.parse();
            // const bp = true;
            return "";
        })
        .catch(ErrorProcessor.handleCliError);

    res.send({
        route: "test",
    });
});

export {router};
