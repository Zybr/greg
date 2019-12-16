import client = require("superagent");
import googleConf = require("../configs/google.js");
import {Request} from "../parser/Request";
import {SelectorDecoder} from "../parser/SelectorDecoder";
import {ICrawler} from "../parser/types/ICrawler";
import {ISelectorsMap} from "../parser/types/selectors";
import {DataModifier} from "../parser/xpath/DataModifier";
import {Parser as XpathParser} from "../parser/xpath/Parser";
import {XmlConverter} from "../parser/xpath/XmlConverter";
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
                return (new GoogleCatalogCrawler(this.createXpathParser(googleConf.selectors), client))
                    .setRequest(new Request(
                        googleConf.request.url,
                        googleConf.request.method || "GET",
                        googleConf.request.parameters || {},
                    )).setRequest(googleConf.request);
            default:
                throw Error("Type of crawler is invalid.");
        }
    }

    private static createXpathParser(selectorsMaps: ISelectorsMap): XpathParser {
        return new XpathParser(
            new XmlConverter(),
            new SelectorDecoder(),
            new DataModifier(),
            selectorsMaps,
        );
    }
}
