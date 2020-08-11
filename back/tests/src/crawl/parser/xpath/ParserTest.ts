import * as chai from "chai";
import { should } from "chai";
import chaiString = require("chai-string");
import { readFileSync } from "fs";
import { Colorizer } from "../../../../../src/core/Colorizer";
import { SelectorDecoder } from "../../../../../src/crawl/parser/SelectorDecoder";
import { ISelectorsMap } from "../../../../../src/crawl/parser/types/selectors";
import { DataModifier } from "../../../../../src/crawl/parser/xpath/DataModifier";
import { Parser } from "../../../../../src/crawl/parser/xpath/Parser";
import { XmlConverter } from "../../../../../src/crawl/parser/xpath/XmlConverter";
import { createDebugger } from "../../../../resource/src/debugger";

const debug = createDebugger("test:xpath:parser");
const pathTestData = __dirname + "/../../../../resource/data/";
chai.use(chaiString);
should();
Colorizer.color();

describe("xpath/Parser", () => {
    const selectorsMap: ISelectorsMap = {
        collections: {
            properties: {
                index: {
                    query: "//ul[@class='links']/li[1]/a/text() | shift",
                },
                structure: {
                    properties: {
                        link: "//*[@class='link']/a/@href | shift | toString | trim",
                        snippet: "//div[@class='snippet']/text() | shift",
                        title: "//*[@class='title']/h3 | shift | firstChild",
                    },
                    query: "//div[@class='catalog']/*[@class='item']",
                },
            },
            query: "//body | shift",
        },
        cyrillic: "//*[@class='cyrillic']/text() | shift",
        modifiers: {
            properties: {
                attr: "//*[@class='tags']/a[@href]/@href | shift | toString | trim",
                html: "//*[@class='tags'] | shift",
                match: "//*[@class='text'] | shift | toString | match : a",
                nodeMethod: "//a | shift | hasChildNodes",
                nodeProp: "//a | shift | firstChild",
                regExpMatch: "//*[@class='text'] | shift | toString | match : /cl+/igm",
                regExpReplace: "//*[@class='text'] | shift | toString | replace : /[^\\s]+/igm : +",
                replace: "//*[@class='text']/text() | shift | toString | replace : a : +",
                xpathMethod: "//*[@class='tags']/a[@href]/text() | shift | toString | trim",
            },
            query: "//*[@class='text-list'] | shift",
        },
    };
    const parser = new Parser(
        new XmlConverter(),
        new SelectorDecoder(),
        new DataModifier(),
        selectorsMap,
    );
    const content = readFileSync(`${pathTestData}markup/elements.html`).toString();

    describe(".parse() [+ XmlConverter, CollectionModifier, NodeModifier, SelectorDecoder]", () => {
        it("Should promise result according request.", async () => {
            debug(".parse()");
            debug("selectors", selectorsMap);

            const result: {
                collections?: {
                    index?: string,
                    structure: [
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
                    match?: {
                        0: string,
                        index: number,
                        input: string,
                    },
                    nodeMethod?: boolean,
                    nodeProp?: string,
                    regExpMatch?: [],
                    regExpReplace?: string,
                    replace?: string,
                    xpathMethod?: string,
                },
            } = await parser
                .parse(content)
                .catch(() => {
                    throw new Error("Parsing error.");
                });

            debug("result", result);

            // Item from collection by index.
            result.collections.index
                .should.be.eq("amazon");

            // List of items with structure.
            result.collections.structure
                .should.be.an("array")
                .to.have.length(5);
            result.collections.structure.forEach((item) => {
                item.link.should.be.a("string");
                item.link.should.startsWith("href=");
                item.snippet.should.be.a("string");
                item.title.should.be.a("string");
            });

            // Cyrillic.
            result.cyrillic.should.be.a("string");

            // Modifiers.
            result.modifiers.should.be.a("object");

            // Modifier "attr".
            result.modifiers.attr.should.a("string")
                .startsWith("href=");

            // Modifier "html".
            result.modifiers.html.should.a("string")
                .include("<");

            // Modifier "match".
            result.modifiers.match.should.a("array");
            result.modifiers.match[0].should.be.eq("a");

            // Node method.
            result.modifiers.nodeMethod.should.a("boolean")
                .eq(true);

            // Node property.
            result.modifiers.nodeProp.should.a("string")
                .eq("hao123");

            // RegExp match.
            result.modifiers.regExpMatch.should.a("array")
                .to.have.all.members(["cl"]);

            // RegExp replace.
            result.modifiers.regExpReplace.should.a("string")
                .contains("+");

            // Replace.
            result.modifiers.regExpReplace.should.a("string")
                .contains("+");

            // XPath method.
            result.modifiers.xpathMethod.should.a("string")
                .eq("hao123");
        });
    });
});
