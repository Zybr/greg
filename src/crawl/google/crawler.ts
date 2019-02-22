import {Observable} from "rxjs";

interface ICrawler {
    constructor();

    setUrl(url): this

    crawl(): Observable<string>;
}

interface IParser {
    setContent(content: string): this

    parse(): Observable<string>
}

