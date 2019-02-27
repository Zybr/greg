import {should} from "chai";
import superagent = require("superagent");
import config = require("../../../../config/test.js");
import {Colorizer} from "../../../../src/core/Colorizer";
import {ErrorProcessor} from "../../../../src/core/ErrorProcessor";
import {Parser} from "../../../../src/crawl/google/Parser";

should();
Colorizer.color();

describe("google/Parser", () => {
    const parser: Parser = new Parser();
    const prepares = [];

    before(() => {
        const contentPromise = superagent
            .get(config.resourceBaseUrl + "/google")
            .then((response: any) => parser.setContent(response.text))
            // .then((response: any) => console.log(response.text))
            .catch(ErrorProcessor.handleCliError);

        prepares.push(contentPromise);
    });

    describe("Parser", () => {
        it("parser() should return list of items", () => {
            Promise.all(prepares).then(() => {
                const bp = true;
                parser
                    .parse()
                    .then((items) => {
                        const bp = true;
                        items.should.be.an("array")
                            .length(10);
                    }).catch(ErrorProcessor.handleCliError);
            });
        });
    });
});
