import * as io from "socket.io-client";
import { backUrl } from "../configs/config";

/**
 * Client for conversation wit server by socket connection.
 */
export class Client {

    /** Socket connection */
    private socket;

    /**
     * Client constructor.
     */
    constructor() {
        this.socket = io.connect(backUrl);
    }

    /**
     * Emmit event.
     *
     * @param event
     * @param data
     */
    public emit(event: string, data: object) {
        this.socket.emit(event, data);
    }

    /**
     * Subscribe on event.
     *
     * @param eventName
     * @param handler
     */
    public on(eventName: string, handler): Client {
        this.socket.on(eventName, handler);

        return this;
    }
}
