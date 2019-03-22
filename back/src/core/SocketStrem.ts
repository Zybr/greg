import debugMod = require("debug");

const debug = debugMod("socket-stream");

/**
 * Data stream for socket connect.
 */
export class SocketStream {

    /**
     * List of subscribes (responses).
     */
    private clients = [];

    /**
     * Subscribe to stream.
     */
    public subscribe(response: any) {
        const beforeSubscribeCnt = this.clients.length;
        this.clients.push(response);
        console.log("Subscribed: %d -> %d", beforeSubscribeCnt, this.clients.length);

        response.on("close", () => {
            const beforeUnsubscribeCnt = this.clients.length;
            this.clients.splice(this.clients.indexOf(response), 1);
            debug("Unsubscribed: %d -> %d", beforeUnsubscribeCnt, this.clients.length);
        });
    }

    /**
     * Notify subscribers.
     *
     * @param data
     */
    public publish(data: any) {
        const beforeUnsubscribeCnt = this.clients.length;

        while (true) {
            const response = this.clients.pop();

            if (!response) {
                break;
            }

            response.end(data);
        }

        debug('Publish: "%s"', data, this.clients.length);
        debug("Unsubscribe: %d -> %d", beforeUnsubscribeCnt, this.clients.length);
    }
}
