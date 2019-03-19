import {Observable, Observer} from "rxjs";
import {SuperAgentStatic} from "superagent";
import request = require("superagent");
import {Parser} from "./Parser";
import {ICrawler} from "./types/ICrawler";
import {IParser} from "./types/IParser";

/**
 * CatalogCrawler.
 * It provides data from consistently connected pages.
 */
export class CatalogCrawler implements ICrawler {
    /**
     * HTTP(S) client.
     */
    private client: SuperAgentStatic;

    /**
     * Page parser.
     */
    private parser: IParser;

    /**
     * Data from last page.
     */
    private lastContent: null | {
        data?: {},
        nextUrl?: string,
    };

    /**
     * Constructor.
     */
    constructor(parser: Parser) {
        this.parser = parser;
        this.client = request;
    }

    /**
     * Bypass related pages and provide parsed content of pages.
     */
    public crawl(url: string): Observable<object> {
        return new Observable((observer: Observer<{}>) => {
            this.parseChainPages(url, observer);
        });
    }

    /**
     * Parse content of related pages.
     *
     * @param url
     * @param observer
     */
    private parseChainPages(url: string, observer: Observer<{}>): void {
        this.getContent(url)
            .then((markup) => this.parser.parse(markup))
            .then((content) => this.lastContent = content)
            .then((content) => {
                observer.next(content);
                const nextUrl = this.getNextUrl();

                if (null === nextUrl) {
                    return observer.complete();
                }

                this.parseChainPages(nextUrl, observer);
            })
            .catch((error) => observer.error(error));
    }

    /**
     * Get content by URL.
     *
     * @param {string} url
     */
    private getContent(url: string): Promise<string> {
        // TODO: handle case with invalid URL.
        return this.client
            .get(url)
            .then((value) => value.text);
    }

    /**
     * Get URL of next page.
     */
    private getNextUrl(): null | string {
        return this.lastContent.nextUrl || null;
    }
}
