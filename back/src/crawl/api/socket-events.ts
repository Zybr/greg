/** Data-objects for events. */
import {eventNames} from "./event-names";

/** Incoming events. */

/**
 * Event data for crawler.
 * It controls crawler.
 */
interface ICrawlerIncData {
    /** ID of crawler. */
    id: null | string;
    /** Type of crawler. */
    type: null | string;
}

/**
 * Search parameters for crawler.
 */
interface ICrawlerSearchIncData extends ICrawlerIncData {
    /** Parameters for query. */
    query: IQueryParams;
}

/**
 * Query parameters for crawler.
 */
interface IQueryParams {
    search: string;
}

/** Incoming events. */

/**
 * Event data of crawler.
 * It shows changed state of crawler.
 */
interface ICrawlerOutData {
    /** ID of crawler. */
    id: null | string;
}

/**
 * Fetched next page.
 */
interface ICrawlerNextOutData {
    /** ID of crawler. */
    id?: string;
    /** Parsed items. */
    items?: object[];
}

/**
 * Crawler error.
 */
interface IErrorOutData {
    message: string;
    stack: object;
}

/**
 * Crawler error.
 */
interface ICrawlerErrorOutData extends IErrorOutData, ICrawlerOutData {
}

export {
    eventNames,
    ICrawlerIncData,
    ICrawlerSearchIncData,
    IQueryParams,
    ICrawlerNextOutData,
    ICrawlerOutData,
    IErrorOutData,
    ICrawlerErrorOutData,
};
