import {Observable} from "rxjs";
import {ICrawler} from "../ICrawler";
import {Parser} from "../parser/Parser";
import {IParser} from "../parser/types/IParser";

/**
 * Google Crawler
 */
export class Crawler implements ICrawler {
    private baseUrl: string;
    private parser: IParser;

    /**
     * @param baseUrl
     */
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.parser = new Parser();
    }

    /**
     * Crawl source.
     */
    public crawl(): Observable<object> {
        return new Observable();
    }
}
