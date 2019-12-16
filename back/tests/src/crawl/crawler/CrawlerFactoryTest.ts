import {should} from "chai";
import {Colorizer} from "../../../../src/core/Colorizer";
import {CrawlerFactory} from "../../../../src/crawl/crawler/CrawlerFactory";
import {GoogleCatalogCrawler} from "../../../../src/crawl/crawler/GoogleCatalogCrawler";

should();
Colorizer.color();

describe("CrawlerFactory", () => {
    describe(".getCrawler()", () => {
        it(
            "Should return crawler for google.",
            () => CrawlerFactory.getCrawler(CrawlerFactory.GOOGLE_CRAWLER).should.be.instanceof(GoogleCatalogCrawler),
        );
    });
});
