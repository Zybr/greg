import { should } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import { readdirSync, readFileSync } from "fs";
import client = require("superagent");
import { Colorizer } from "../../../../src/core/Colorizer";
import { CatalogCrawler } from "../../../../src/crawl/crawler/CatalogCrawler";
import { Request } from "../../../../src/crawl/parser/Request";
import { Parser } from "../../../../src/crawl/parser/selector/Parser";
import { SelectorDecoder } from "../../../../src/crawl/parser/SelectorDecoder";
import { ISelectorsMap } from "../../../../src/crawl/parser/types/selectors";
import { createDebugger } from "../../../resource/src/debugger";

const debug = createDebugger("test:catalog-crawler");
const dataDirPath = __dirname + "/../../../resource/data/catalog";

chai.use(chaiSpies);
should();
Colorizer.color();

describe("CatalogCrawler [+ Parser, SelectorDecoder]", () => {
    const selectors: ISelectorsMap = {
        items: {
            properties: {
                snippet: "> div.snippet",
                title: "> h3",
            },
            query: `.content > div.item | ${Parser.ARRAY_MOD}`,
        },
        nextUrl: "ul.pagination a.next | attr : href",
    };
    const parser = new Parser(new SelectorDecoder(), selectors);
    const crawler = new CatalogCrawler(parser, client);
    let url: string;

    before(() => {
        // Spy "client"
        const markups = {};
        readdirSync(dataDirPath)
            .forEach((fileName: string) => markups[fileName] = readFileSync(`${dataDirPath}/${fileName}`).toString());
        url = Object.keys(markups)[0];
        chai.spy.on(client, "get", (nextUrl: string) => ({
            set: () => ({
                query: () => Promise.resolve({text: markups[nextUrl]}),
            }),
        }));
    });

    after(() => {
        chai.spy.restore();
    });

    describe(".crawl()", () => {
        it("Should throw exception when it is called before .setRequest().", () => {
            chai.expect(() => crawler.crawl()).to.throw();
        });

        it("Should emit content of page according selectors.", async () => {
            debug(".setRequest()");
            crawler.setRequest(new Request(url));
            debug(".crawl()");
            crawler.crawl()
                .subscribe({
                    complete: () => debug("Complete"),
                    error: (error) => console.error(error),
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

    describe(".stop()", () => {
        it("Should stop crawling.", () => {
            const maxIteration = 2;
            let curIteration = 0;

            crawler
                .setRequest(new Request(url))
                .crawl()
                .subscribe({
                    complete: () => {
                        chai.assert.equal(curIteration, maxIteration + 1);
                        debug("Complete");
                    },
                    error: (error) => console.error(error),
                    next: () => {
                        curIteration++;
                        // It should finish on next iteration.
                        if (maxIteration === curIteration) {
                            crawler.stop();
                        }
                    },
                });
        });
    });

    describe(".setRequest()", () => {
        it("Should return self.", () => {
            crawler.setRequest(new Request(url)).should.be.instanceof(CatalogCrawler);
        });
    });
});
