import {should} from "chai";
import superagent = require("superagent");
import config = require("../../../../config/test.js");
import {Colorizer} from "../../../../src/core/Colorizer";
import {ErrorProcessor} from "../../../../src/core/ErrorProcessor";
import {XPathParser} from "../../../../src/crawl/google/XPathParser";

should();
Colorizer.color();

describe("google/XPathParser", () => {
    const parser: XPathParser = new XPathParser();
    const prepares = [];

    before(() => {
        const contentPromise = superagent
            .get(config.resourceBaseUrl + "/google")
            .then((response: any) => parser.setContent(response.text))
            .catch(ErrorProcessor.handleCliError);

        prepares.push(contentPromise);
    });

    describe("XPathParser", () => {
        it("parser() should return list of items", () => {
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
