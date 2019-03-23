import {should} from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import debugMod = require("debug");
import {readdirSync, readFileSync} from "fs";
import {Colorizer} from "../../../../src/core/Colorizer";
import {CatalogCrawler} from "../../../../src/crawl/parser/CatalogCrawler";
import {Parser} from "../../../../src/crawl/parser/Parser";
import {ISelectorsMap} from "../../../../src/crawl/parser/types/html-selectors/ISelectorsMap";

const debug = debugMod("test:catalog-crawler");
const dataDirPath = __dirname + "/../../../data/catalog";

chai.use(chaiSpies);
should();
Colorizer.color();

describe("CatalogCrawler (Parser, NodeModifier)", () => {
    const selectors: ISelectorsMap = {
        items: {
            properties: {
                snippet: "> div.snippet",
                title: "> h3",
            },
            query: ".content > div.item | []",
        },
        nextUrl: "ul.pagination a.next | attr:href",
    };
    const parser = new Parser(selectors);
    const crawler = new CatalogCrawler(parser);
    let url: string;

    before(() => {
        // Spy CatalogCrawler.getContent().
        const markups = {};
        readdirSync(dataDirPath)
            .forEach((fileName: string) => markups[fileName] = readFileSync(`${dataDirPath}/${fileName}`).toString());
        url = Object.keys(markups)[0];
        chai.spy.on(crawler, "getContent", (nextUrl: string) => {
            return Promise.resolve(markups[nextUrl]);
        });
    });

    describe(".crawl()", () => {
        it("Should emit content of page according selectors.", async () => {
            const result = crawler.crawl(url);
            result.subscribe({
                error: (error) => {
                    console.error(error);
                },
                next: (pageContent: { items?: object[] }) => {
                    debug(JSON.stringify(pageContent, null, 4));
                    pageContent.should.be.an("object");

                    // Next URL.
                    pageContent.should.have.property("nextUrl");

                    // Items.
                    pageContent.items.forEach((item) => {
                        item.should.be.an("object")
                            .have.property("snippet")
                            .to.be.a("string");
                        item.should.be.an("object")
                            .have.property("title")
                            .to.be.a("string");
                    });
                },
            });
        });
    });
});
