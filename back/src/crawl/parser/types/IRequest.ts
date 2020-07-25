export type TMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Request parameters.
 */
export interface IRequest {
    /** Target URL. */
    url: string;

    /** Method of request. */
    method: TMethod;

    /** Query parameters. */
    parameters: {
        [param: string]: any,
    };

    /** Delay before next request. */
    delay: null | number;
}
