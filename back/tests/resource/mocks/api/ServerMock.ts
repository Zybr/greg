import { ClientMock } from "./ClientMock";
import { EventEmitterMock } from "./EventEmitterMock";

export class ServerMock extends EventEmitterMock {
    private client: ClientMock = new ClientMock();

    public on(event: string, handler: any) {
        if ("connection" === event) {
            return super.on(
                event,
                () => {
                    handler(this.client);
                },
            );
        }

        return super.on(event, handler);
    }

    public getClient(): ClientMock {
        return this.client;
    }
}
