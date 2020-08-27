import { SuperAgentRequest } from "superagent";
import * as superAgent from "superagent";
import Response from "./Response";

/** Request */
export default class Request {

    /** Real request */
    private request: SuperAgentRequest;

    public constructor(request: SuperAgentRequest) {
        this.request = request;
    }

    /** Send request */
    public async send(parameters: object | null = null): Promise<Response> {
        return new Promise((resolve) => resolve(this.request.send(parameters)))
            .then((response) => Promise.resolve(new Response(response as superAgent.Response)));
    }
}
