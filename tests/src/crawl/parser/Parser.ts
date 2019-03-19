import chai from "chai";
import {should} from "chai";
import chaiString = require("chai-string");
import debugMod = require("debug");
import {readFileSync} from "fs";
import {Colorizer} from "../../../../src/core/Colorizer";
import {Parser} from "../../../../src/crawl/parser/Parser";
import {ISelectorsMap} from "../../../../src/crawl/parser/types/html-selectors/ISelectorsMap";

const debug = debugMod("test:parser");
const pathTestData = __dirname + "/../../../data/";

chai.use(chaiString);
should();
Colorizer.color();

describe("Parser (NodeModifier).", () => {
    const selectorsMap: ISelectorsMap = {
        collections: {
            properties: {
                index: {
                    query: "ul.links > li | []:-1 | text",
                },
                postModifier: {
                    query: "ul.links > li | [] | html",
                },
                structure: {
                    properties: {
                        link: ".link",
                        snippet: "> div.snippet",
                        title: "> div.title > h3",
                    },
                    query: "div.catalog > .item | []",
                },
            },
            query: "body",
        },
        cyrillic: ".cyrillic",
        modifiers: {
            properties: {
                attr: ".tags > a | attr:href",
                html: ".tags | html",
                match: ".text | text | match:a",
                regExpMatch: ".text | text | match:/[^\\s]+/igm",
                regExpReplace: ".text | text | replace:/[^\\s]+/igm:+",
                replace: ".text | text | replace:a:+",
                text: ".tags | text",
            },
            query: ".text-list",
        },
    };
    const parser: Parser = new Parser(selectorsMap);
    const content = readFileSync(`${pathTestData}/markup/elements.html`).toString();

    describe(".parse()", () => {
        it("Should return result according request", async () => {
            const result: {
                collections?: {
                    index?: any,
                    postModifier?: any,
                    structure?: [
                        {
                            link: any,
                            snippet: any,
                            title: any,
                        }
                        ],
                },
                cyrillic?: any,
                modifiers?: {
                    attr?: any,
                    html?: any,
                    match?: any,
                    regExpMatch?: any,
                    regExpReplace?: any,
                    replace?: any,
                    text?: any,
                },
            } = await parser
                .parse(content);

            debug(JSON.stringify(result, null, 4));

            result.should.be.an("object");

            // Apply modifiers after fetch list.
            result.should.have.property("collections");
            result.collections.postModifier
                .should.be.an("array")
                .to.have.length(12);
            result.collections.postModifier.forEach((postModItem) => postModItem.should.to.be.a("string"));

            // Item from collection by index.
            result.collections.index
                .should.be.an("string")
                .eq("360");

            // List of items with structure.
            result.collections.structure
                .should.be.an("array")
                .to.have.length(5);
            result.collections.structure.forEach((structureItem) => {
                structureItem.should.to.be.a("object");
                structureItem
                    .should.to.be.a("object");
                structureItem.should.have.property("link")
                    .to.be.a("string");
                structureItem.should.have.property("snippet")
                    .to.be.a("string");
                structureItem.should.have.property("title")
                    .to.be.a("string");
            });

            // Fetch cyrillic.
            result.cyrillic.should.be.a("string");

            // Modifiers.
            result.modifiers.should.be.a("object");

            // Modifier "text".
            result.modifiers.text.should.a("string")
                .include(" ")
                .not.include("<")
                .not.include("+");

            // Modifier "html".
            result.modifiers.html.should.a("string")
                .include("<");

            // Modifier "attr".
            result.modifiers.attr.should.a("string")
                .startsWith("http");

            // Modifier "match".
            result.modifiers.match.should.a("string")
                .eq("a");

            // Modifier "replace".
            result.modifiers.replace.should.a("string")
                .include("+");

            // Modifier "match" with regular expression.
            result.modifiers.regExpMatch.should.a("string")
                .not.include(" ");

            // Modifier "replace" with regular expression.
            result.modifiers.regExpReplace.should.a("string")
                .include("+");
        });
    });
});
