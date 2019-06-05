import {should} from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import debugMod = require("debug");
import {readdirSync, readFileSync} from "fs";
import client = require("superagent");
import {Colorizer} from "../../../../src/core/Colorizer";
import {CatalogCrawler} from "../../../../src/crawl/crawler/CatalogCrawler";
import {Parser} from "../../../../src/crawl/parser/Parser";
import {Request} from "../../../../src/crawl/parser/Request";
import {ISelectorsMap} from "../../../../src/crawl/parser/types/html-selectors";

const debug = debugMod("test:catalog-crawler");
const dataDirPath = __dirname + "/../../../data/catalog";

chai.use(chaiSpies);
should();
Colorizer.color();

describe("CatalogCrawler [+ Parser, NodeModifier]", () => {
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
    const crawler = new CatalogCrawler(parser, client);
    let url: string;

    before(() => {
        // Spy "client.get()"
        const markups = {};
        readdirSync(dataDirPath)
            .forEach((fileName: string) => markups[fileName] = readFileSync(`${dataDirPath}/${fileName}`).toString());
        url = Object.keys(markups)[0];
        chai.spy.on(client, "get", (nextUrl: string) => {
            return {
                query: () => Promise.resolve({text: markups[nextUrl]}),
            };
        });
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

    describe(".stopCrawl()", () => {
        it("Should stop crawling.", () => {
            const maxIteration = 2;
            let curIteration = 0;

            crawler
                .setRequest(new Request(url))
                .crawl()
                .subscribe({
                    complete: () => {
                        chai.assert.equal(curIteration, maxIteration);
                        debug("Complete");
                    },
                    error: (error) => console.error(error),
                    next: () => {
                        curIteration++;
                        if (maxIteration === curIteration) {
                            crawler.stopCrawl();
                        }
                    },
                });
        });
        crawler.stopCrawl().should.be.instanceof(CatalogCrawler);
    });

    describe(".setRequest()", () => {
        it("Should return self.", () => {
            crawler.setRequest(new Request(url)).should.be.instanceof(CatalogCrawler);
        });
    });
});
