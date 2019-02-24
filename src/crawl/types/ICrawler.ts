import {Observable} from "rxjs";

export interface ICrawler {
    crawl(): Observable<object>;
}
