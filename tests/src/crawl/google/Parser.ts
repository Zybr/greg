import {should} from "chai";
import {app} from "../../../../app";
import {Parser} from "../../../../src/crawl/google/Parser";

// const statusCodes = require('http-status-codes');
import {OK} from "http-status-codes";
import superagent = require("superagent");
import supertest = require("supertest");
// import {request} from "superagent";
import {Colorizer} from "../../../../src/core/Colorizer";
import {ErrorProcessor} from "../../../../src/core/ErrorProcessor";

should();
Colorizer.color();

describe("google/Parser", () => {
    // const baseUrl = "http://data/google";
    const baseUrl = "http://test.loc/google";
    const parser: Parser = new Parser();
    const prepares = [];

    before(() => {
        const contentPromise = superagent
            .get(baseUrl)
            .then((response: any) => parser.setContent(response.text))
            .catch(ErrorProcessor.handleCliError);

        prepares.push(contentPromise);
    });

    describe("Parser", () => {
        it("parserItems() should return list of items", () => {
            Promise.all(prepares).then(() => {
                parser
                    .parse()
                    .then((items) => {
                        items.should.be.an("array")
                            .length(10);
                    });
            });
        });
    });
});
