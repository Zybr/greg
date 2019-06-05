import {Observable, Observer} from "rxjs";
import {SuperAgentStatic} from "superagent";
import clientAgent = require("superagent");
import {Parser} from "../parser/Parser";
import {Request} from "../parser/Request";
import {ICrawler} from "../parser/types/ICrawler";
import {IParser} from "../parser/types/IParser";
import {IRequest} from "../parser/types/IRequest";

/**
 * It provides data from consistently connected pages.
 */
export class CatalogCrawler implements ICrawler {
    /** Identifier */
    public id: string;

    /** HTTP(S) client. */
    private client: SuperAgentStatic;

    /** Page parser. */
    private parser: IParser;

    /** Start parameters of query. */
    private request: IRequest;

    /**
     * Current state of crawling:
     *      NULL - crawling is not start.
     *      TRUE - crawling is start.
     *      FALSE - crawling will be stopped.
     */
    private crawlingState: null | boolean = null;

    /** Data from last page. */
    private lastContent: null | {
        data?: {},
        nextUrl?: string,
    };

    /**
     * Constructor.
     */
    constructor(parser: Parser, client: clientAgent.SuperAgentStatic) {
        this.parser = parser;
        this.client = client;
    }

    /**
     * Set start query parameters.
     *
     * @param request
     */
    public setRequest(request: IRequest): CatalogCrawler {
        this.request = request;
        this.setRequestParameters(request.parameters);

        return this;
    }

    /**
     * Set only parameters of request.
     *
     * @param parameters
     */
    public setRequestParameters(parameters: {}): CatalogCrawler {
        this.request.parameters = parameters;

        return this;
    }

    /**
     * Bypass related pages and provide parsed content of pages.
     */
    public crawl(): Observable<object> {
        if (!this.request) {
            throw new Error("Initial request is not defined.");
        }

        return new Observable((observer: Observer<{}>) => {
            this.parseChainPages(this.request, observer);
        });
    }

    /**
     * Stop crawl.
     */
    public stopCrawl(): CatalogCrawler {
        this.crawlingState = (true === this.crawlingState) ? false : this.crawlingState;

        return this;
    }

    /**
     * Parse content of related pages.
     *
     * @param request
     * @param observer
     */
    private parseChainPages(request: IRequest, observer: Observer<{}>): void {
        if (false === this.crawlingState) { // Check state.
            // Finish.
            this.crawlingState = null;
            observer.complete();

            return;
        }

        this.crawlingState = true;
        this.getContent(request)
            .then((markup) => this.parser.parse(markup))
            .then((content) => this.lastContent = content)
            .then((content) => {
                observer.next(content);
                const nextRequest = this.getNextRequest();

                if (null === nextRequest) { // Check next url.
                    // Finish.
                    this.crawlingState = null;
                    observer.complete();

                    return;
                }

                this.parseChainPages(nextRequest, observer);
            })
            .catch((error) => {
                this.crawlingState = null;
                observer.error(error);
            });
    }

    /**
     * Get content by URL.
     *
     * @param request
     */
    private getContent(request: IRequest): Promise<string> {
        // TODO: handle case with invalid URL.
        return this.client
            .get(request.url)
            .query(this.request.parameters)
            .then((value) => value.text);
    }

    /**
     * Get parameters for next request.
     */
    private getNextRequest(): null | IRequest {
        return (this.lastContent.nextUrl)
            ? new Request(this.lastContent.nextUrl)
            : null;
    }
}
