import { Observable } from "rxjs";
import { IRequest } from "./IRequest";

/**
 * Crawler.
 */
export interface ICrawler {
    /** Identifier. */
    id: string;

    /** Set start request parameters. */
    setRequest(request: IRequest): ICrawler;

    /** Set parameters of request. */
    setRequestParameters(parameters: {}): ICrawler;

    /** Start crawling. */
    crawl(): Observable<object>;

    /** Stop crawling. */
    stop(): ICrawler;
}
