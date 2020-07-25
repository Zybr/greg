import { IRequest, TMethod } from "./types/IRequest";

/**
 * Request parameters.
 */
export class Request implements IRequest {
    /** @inheritDoc */
    public method: TMethod;

    /** @inheritDoc */
    public parameters: {
        [parameter: string]: any,
    };

    /** @inheritDoc */
    public url: string;

    /** @inheritDoc */
    public delay: null | number;

    public constructor(url: string, method: TMethod = "GET", parameters: object = {}) {
        this.url = url;
        this.method = method;
        this.parameters = parameters;
        this.delay = null;
    }
}
