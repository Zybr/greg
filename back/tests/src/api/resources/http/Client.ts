import chai = require("chai");
import { should } from "chai";
import chaiHttp = require("chai-http");
import chaiJsonSchema = require("chai-json-schema");
import { SuperAgentStatic } from "superagent";
import { app } from "../../../../../app";
import Request from "./Request";

/** HTTP client */
export default class Client {

    /** Real client */
    private http: SuperAgentStatic;

    constructor() {
        // Configure assertion library
        chai.use(chaiHttp);
        chai.use(chaiJsonSchema);
        should();
        // Init client
        this.http = chai.request(app).keepOpen();
    }

    /** Initialize POST request. */
    public post(url: string): Request {
        return new Request(this.http.post(url));
    }

    /** Initialize GET request. */
    public get(url: string): Request {
        return new Request(this.http.get(url));
    }

    /** Initialize PUT request. */
    public put(url: string): Request {
        return new Request(this.http.put(url));
    }

    /** Initialize PATCH request. */
    public patch(url: string): Request {
        return new Request(this.http.patch(url));
    }

    /** Initialize DELETE request. */
    public delete(url: string): Request {
        return new Request(this.http.delete(url));
    }
}
