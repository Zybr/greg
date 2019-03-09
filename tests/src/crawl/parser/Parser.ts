import {should} from "chai";
import debugMod = require("debug");
import {readFileSync} from "fs";
import {Colorizer} from "../../../../src/core/Colorizer";
import {Parser} from "../../../../src/crawl/parser/Parser";
import {ISelectorsMap} from "../../../../src/crawl/parser/types/html-selectors/ISelectorsMap";

const debug = debugMod("test");
const pathTestData = __dirname + "/../../../data/";

should();
Colorizer.color();

describe("google/Parser", () => {
    const parser: Parser = new Parser();
    const selectorsMap: ISelectorsMap = {
        collections: {
            properties: {
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

    before(async () => {
        const content = readFileSync(`${pathTestData}catalog.html`).toString();
        parser.setContent(content)
            .setSelectorMap(selectorsMap);
    });

    describe("Parser", () => {
        it("parser() should return result according request", async () => {
            const result: {
                collections?: {
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
                .parse();

            debug(JSON.stringify(result, null, 4));

            result.should.be.an("object");

            result.should.have.property("collections");

            result.collections.postModifier
                .should.be.an("array")
                .to.have.length(12);

            const postModifierItem = result.collections.postModifier.shift() as object;
            postModifierItem
                .should.to.be.a("string");

            result.collections.structure
                .should.be.an("array")
                .to.have.length(5);

            const structureItem = result.collections.structure.shift() as object;
            structureItem
                .should.to.be.a("object");
            structureItem.should.have.property("link")
                .to.be.a("string");
            structureItem.should.have.property("snippet")
                .to.be.a("string");
            structureItem.should.have.property("title")
                .to.be.a("string");

            result.cyrillic.should.be.a("string");

            result.modifiers.should.be.a("object");

            result.modifiers.attr.should.a("string");

            result.modifiers.html.should.a("string")
                .include("<");

            result.modifiers.match.should.a("string")
                .eq("a");

            result.modifiers.regExpMatch.should.a("string")
                .not.include(" ");

            result.modifiers.regExpReplace.should.a("string")
                .include("+");

            result.modifiers.replace.should.a("string")
                .include("+");

            result.modifiers.text.should.a("string")
                .include(" ")
                .not.include("<")
                .not.include("+");
        });
    });
});
