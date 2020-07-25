import { should } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import { readdirSync, readFileSync } from "fs";
import client = require("superagent");
import { Colorizer } from "../../../../src/core/Colorizer";
import crawlerConfig = require("../../../../src/crawl/configs/google.js");
import { GoogleCatalogCrawler } from "../../../../src/crawl/crawler/GoogleCatalogCrawler";
import { Request } from "../../../../src/crawl/parser/Request";
import { SelectorDecoder } from "../../../../src/crawl/parser/SelectorDecoder";
import { TMethod } from "../../../../src/crawl/parser/types/IRequest";
import { DataModifier } from "../../../../src/crawl/parser/xpath/DataModifier";
import { Parser as XpathParser } from "../../../../src/crawl/parser/xpath/Parser";
import { XmlConverter } from "../../../../src/crawl/parser/xpath/XmlConverter";
import { getDebugger } from "../../../resource/src/debugger";

const debug = getDebugger("test:google-catalog-crawler");
const markupFilePath = __dirname + "/../../../resource/data/live/google.html";

chai.use(chaiSpies);
should();
Colorizer.color();

describe("GoogleCatalogCrawler [+ Parser, SelectorDecoder]", () => {
    let parser: XpathParser = null;
    let crawler: GoogleCatalogCrawler = null;

    before(() => {
        // Spy "client"
        const markup = readFileSync(markupFilePath).toString();

        chai.spy.on(client, "get", () => ({
            set: () => ({
                query: () => Promise.resolve({text: markup}),
            }),
        }));

        // Create crawler.
        parser = new XpathParser(
            new XmlConverter(),
            new SelectorDecoder(),
            new DataModifier(),
            crawlerConfig.selectors,
        );
        crawler = (new GoogleCatalogCrawler(parser, client))
            .setRequest(new Request(
                crawlerConfig.request.url,
                crawlerConfig.request.method as TMethod || "GET",
                crawlerConfig.request.parameters || {},
            ));
    });

    after(() => {
        chai.spy.restore();
    });

    describe(".crawl()", () => {
        it("It should return stream of parsed pages.", async () => {
            debug({crawlerConfig});
            crawler.crawl()
                .subscribe({
                    complete: () => debug("Complete"),
                    error: (error) => console.error(error),
                    next: (pageContent: { items?: object[] }) => {
                        crawler.stop();

                        debug({pageContent});

                        pageContent.should.be.an("object");

                        // Next URL.
                        pageContent.should.have.property("nextUrl")
                            .to.be.a("string");

                        // Items.
                        pageContent.items.should.have.length(10);
                        pageContent.items.forEach((item) => {
                            item.should.be.an("object")
                                .have.property("title")
                                .to.be.a("string")
                                .have.length.greaterThan(1);
                            item.should.be.an("object")
                                .have.property("url")
                                .to.be.a("string")
                                .have.length.greaterThan(1);
                            item.should.be.an("object")
                                .have.property("snippet")
                                .to.be.a("string")
                                .to.be.a("string")
                                .have.length.greaterThan(1);
                        });
                    },
                });
        });
    });
});
