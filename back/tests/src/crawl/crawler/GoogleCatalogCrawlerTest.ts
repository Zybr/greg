import {should} from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import debugMod = require("debug");
import {readdirSync, readFileSync} from "fs";
import client = require("superagent");
import {Colorizer} from "../../../../src/core/Colorizer";
import crawlerConfig = require("../../../../src/crawl/configs/google.js");
import {GoogleCatalogCrawler} from "../../../../src/crawl/crawler/GoogleCatalogCrawler";
import {Parser} from "../../../../src/crawl/parser/Parser";
import {Request} from "../../../../src/crawl/parser/Request";

const debug = debugMod("test:google-catalog-crawler");
const markupFilePath = __dirname + "/../../../data/live/google.html";

chai.use(chaiSpies);
should();
Colorizer.color();

describe("GoogleCatalogCrawler [+ Parser, NodeModifier]", () => {
    let parser: Parser = null;
    let crawler: GoogleCatalogCrawler = null;

    before(() => {
        // Spy "client.get()"
        const markup = readFileSync(markupFilePath).toString();

        chai.spy.on(client, "get", () => {
            return {
                query: () => Promise.resolve({text: markup}),
            };
        });
        // Create crawler.
        parser = new Parser(crawlerConfig.selectors);
        crawler = (new GoogleCatalogCrawler(parser, client))
            .setRequest(new Request(
                crawlerConfig.request.url,
                crawlerConfig.request.method || "GET",
                crawlerConfig.request.parameters || {},
            ));
    });

    after(() => {
        chai.spy.restore();
    });

    describe(".crawl()", () => {
        describe.skip("The parser does not select the desired items by direct queris", () => {
            it("Should emit content of page according selectors.", async () => {
                crawler.crawl()
                    .subscribe({
                        complete: () => debug("Complete"),
                        error: (error) => console.error(error),
                        next: (pageContent: { items?: object[] }) => {
                            debug(JSON.stringify(pageContent, null, 4));

                            pageContent.should.be.an("object");
                            // Next URL.
                            pageContent.should.have.property("nextUrl")
                                .to.be.a("string");
                            // Items.
                            pageContent.items.forEach((item) => {
                                item.should.be.an("object")
                                    .have.property("title")
                                    .to.be.a("string");
                                item.should.be.an("object")
                                    .have.property("url")
                                    .to.be.a("string");
                                item.should.be.an("object")
                                    .have.property("snippet")
                                    .to.be.a("string");
                            });

                            crawler.stopCrawl();
                        },
                    });
            });
        });
    });
});
