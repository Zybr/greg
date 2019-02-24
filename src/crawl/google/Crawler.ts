import {Observable} from "rxjs";
import {ICrawler} from "../types/ICrawler";
import {IParser} from "../types/IParser";
import {Parser} from "./Parser";

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
     *
     */
    public crawl(): Observable<object> {
        return new Observable();
    }
}
