import {should} from "chai";
import {app} from "../../../../app";
import {Parser} from "../../../../src/crawl/google/Parser";

// const statusCodes = require('http-status-codes');
import {OK} from "http-status-codes";
import supertest = require("supertest");
import superagent, {Response} from "supertest";
import {ErrorProcessor} from "../../../../src/core/ErrorProcessor";

should();

describe("google/Parser", () => {
    const baseUrl = "http://data/google";
    const parser: Parser = new Parser();
    // let content: string;

    before(() => {
        superagent(app)
            .get(baseUrl)
            .then((response: Response) => {
                if (response.status !== OK) {
                    throw new Error(`Can not get test content. Returned response with status ${response.status}`);
                }

                parser.setContent(response.text);
            }).catch(ErrorProcessor.handleCliError);
    });

    describe("Parser", () => {
        it("parserItems() should return list of items", () => {
            parser
                .parseItems()
                .then((items) => {
                    items.should.be.an("array");
                });
        });
    });
});
