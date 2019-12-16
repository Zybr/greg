import {IRequest, TMethod} from "./types/IRequest";

/**
 * Request.
 */
export class Request implements IRequest {
    public method: TMethod;

    public parameters: {
        [parameter: string]: any,
    };

    public url: string;

    public delay: null | number;

    public constructor(url: string, method: TMethod = "GET", parameters: object = {}) {
        this.url = url;
        this.method = method;
        this.parameters = parameters;
        this.delay = null;
    }
}
