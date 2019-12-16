interface IEvent {
    event: string;
    data: any;
}

interface ISubscriber {
    event: string;
    handler: any;
}

export class EventEmitterMock {
    private events: IEvent[] = [];
    private subscribers: ISubscriber[] = [];

    public on(event: string, handler: any) {
        this.subscribers.push({event, handler});

        return this;
    }

    public emit(event: string, data: any) {
        this.events.push({event, data});

        this.subscribers.forEach((subscriber: ISubscriber) => {
            if (event === subscriber.event) {
                subscriber.handler(data);
            }
        });
    }

    public getEvents() {
        return this.events;
    }

    public getSubscribers() {
        return this.subscribers;
    }
}
