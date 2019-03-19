import {Observable} from "rxjs";

export interface ICrawler {
    crawl(url: string): Observable<object>;
}
