import client = require("superagent");
import googleConf = require("../configs/google.js");
import {Parser} from "../parser/Parser";
import {Request} from "../parser/Request";
import {ICrawler} from "../parser/types/ICrawler";
import {GoogleCatalogCrawler} from "./GoogleCatalogCrawler";

/**
 * It is factory of crawlers.
 */
export class CrawlerFactory {
    /** Identifier of google crawler. */
    public static readonly GOOGLE_CRAWLER = "google";

    /** All crawler identifiers. */
    public static readonly CRAWLERS = [
        CrawlerFactory.GOOGLE_CRAWLER,
    ];

    /**
     * Get specific factory.
     *
     * @param crawlerType
     */
    public static getCrawler(crawlerType: string): ICrawler {
        switch (crawlerType) {
            case CrawlerFactory.GOOGLE_CRAWLER:
                const parser = new Parser(googleConf.selectors);
                return (new GoogleCatalogCrawler(parser, client))
                    .setRequest(new Request(
                        googleConf.request.url,
                        googleConf.request.method || "GET",
                        googleConf.request.parameters || {},
                    ));
            default:
                throw Error("Type of crawler is invalid.");
        }
    }
}
