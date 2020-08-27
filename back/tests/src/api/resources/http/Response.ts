import * as request from "superagent";

/** Response */
export default class Response {

    /** Real response */
    private response: request.Response;

    public constructor(response: request.Response) {
        this.response = response;
    }

    /** Get status */
    public get status(): number {
        return this.response.status;
    }

    /** Get body */
    public get body(): any {
        return this.response.body;
    }

    /**
     * Check response status.
     * @param status HTTP status
     */
    public assertStatus(status: number): this {
        this.response.status.should.be.eq(status);
        return this;
    }

    /**
     * Check structure of body.
     * @param schema
     */
    public assertBodySchema(schema: object): this {
        this.response.body.should.be.jsonSchema(schema);
        return this;
    }

    /**
     * Check content of body.
     * @param body
     */
    public assertBodyEqual(body: object): this {
        this.response.body.should.be.deep.equal(body);
        return this;
    }
}
