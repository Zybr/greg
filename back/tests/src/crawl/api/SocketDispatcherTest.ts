import {should} from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import {readdirSync, readFileSync} from "fs";
import {Observable, Observer} from "rxjs";
import io = require("socket.io");
import clientAgent = require("superagent");
import {Colorizer} from "../../../../src/core/Colorizer";
import {ICrawlerIncData, ICrawlerOutData} from "../../../../src/crawl/api/socket-events";
import {SocketDispatcher} from "../../../../src/crawl/api/SocketDispatcher";
import {CatalogCrawler} from "../../../../src/crawl/crawler/CatalogCrawler";
import {CrawlerFactory} from "../../../../src/crawl/crawler/CrawlerFactory";
import {Parser} from "../../../../src/crawl/parser/selector/Parser";
import {ServerMock} from "../../../resource/mocks/api/ServerMock";
import {getDebugger} from "../../../resource/src/debugger";

const debug = getDebugger("test:socket-dispatcher");

chai.use(chaiSpies);
should();
Colorizer.color();

describe("SocketDispatcher.", () => {
    const events = {
        complete: "crawler:complete",
        connect: "connection",
        create: "crawler:create",
        created: "crawler:created",
        disconnect: "disconnect",
        error: "crawler:error",
        next: "crawler:next",
        start: "crawler:start",
        started: "crawler:started",
        stop: "crawler:stop",
        stopped: "crawler:stopped",
    };
    const defaultStreamActs = [
        (observer) => {
            observer.next({
                items: [],
                nextUrl: "/next-page",
            });
        },
        (observer) => {
            observer.next({
                items: [],
                nextUrl: null,
            });
        },
        (observer) => observer.complete(),
    ];
    const streamActDelay = 100;
    let dispatcher: SocketDispatcher;

    /**
     * Mock catalog crawler.
     */
    function mockCrawler(): CatalogCrawler {
        const mockParser = chai.spy.on(Parser, []);
        const mockClient = chai.spy.on(clientAgent, []);
        const catalogCrawler = new CatalogCrawler(mockParser, mockClient);
        // Crawler.
        chai.spy.on(CatalogCrawler, "setRequest", () => catalogCrawler);
        chai.spy.on(catalogCrawler, "setRequestParameters", () => catalogCrawler);
        chai.spy.on(catalogCrawler, "stopCrawl", () => catalogCrawler);
        // Factory.
        chai.spy.on(CrawlerFactory, "getCrawler", () => catalogCrawler);

        return catalogCrawler;
    }

    /**
     * Mock stream of catalog crawler.
     *
     * @param catalogCrawler
     * @param streamActions
     */
    function mockCrawlerStream(
        catalogCrawler: CatalogCrawler,
        streamActions: null | CallableFunction[],
    ): Observable<{}> {
        const crawlerStream = new Observable((observer: Observer<{}>) => {
            let delay = 0;
            streamActions.forEach((action) => {
                setTimeout(() => action(observer), delay += streamActDelay);
            });
        });

        chai.spy.on(catalogCrawler, "crawl", () => { // Actions of crawler stream.
            return crawlerStream;
        });

        return crawlerStream;
    }

    afterEach(() => {
        chai.spy.restore();
    });

    describe('Client event "crawler:create".', () => {
        const expectedEvents = [
            events.create,
            events.created,
        ];

        it(`Should get events:\n\t ${expectedEvents.join("\n\t ")}`, async () => {
            const server = new ServerMock();
            const client = server.getClient();
            dispatcher = new SocketDispatcher(server as unknown as io.Server);

            server.emit(events.connect, "data");
            client.emit(events.create, {type: "google"});
            const clientEvents = client.getEvents();

            // Debug state.
            debug({
                "client subscribes": client.getSubscribers(),
                "server events": server.getEvents(),
                "server subscribes": server.getSubscribers(),
            });

            // Debug events.
            debug({"client events": clientEvents});

            chai.assert.deepEqual(
                clientEvents.map((event) => event.event), // Event names,
                expectedEvents,
            );
        });
    });

    describe('Client event "crawler:start".', () => {
        const expectedEvents = [
            events.start,
            events.created,
            events.started,
            events.next,
            events.next,
            events.complete,
        ];

        it(`Should get events:\n\t ${expectedEvents.join("\n\t ")}`, async () => {
            const server = new ServerMock();
            const client = server.getClient();
            const crawler = mockCrawler();
            const stream = mockCrawlerStream(crawler, defaultStreamActs);
            let isCompleted = false;
            dispatcher = new SocketDispatcher(server as unknown as io.Server);

            server.emit(events.connect, "data");
            client.emit(events.start, {query: {search: "search"}, type: "google"});

            // Debug state.
            debug({
                "client subscribes": client.getSubscribers(),
                "server events": server.getEvents(),
                "server subscribes": server.getSubscribers(),
            });

            // stream.
            stream.subscribe({
                complete: () => {
                    isCompleted = true;
                    const clientEvents = client.getEvents();

                    // Debug events.
                    debug({"client events": clientEvents});

                    chai.assert.deepEqual(
                        clientEvents.map((event) => event.event), // Event names.
                        expectedEvents,
                    );
                },
                error: (error) => {
                    throw error;
                },
            });

            setTimeout(
                () => chai.assert.isTrue(isCompleted),
                streamActDelay * defaultStreamActs.length,
            );
        });
    });

    describe('Client event "crawler:stop".', () => {
        const expectedEvents = [
            events.start,
            events.created,
            events.started,
            events.next,
            events.stop,
            events.stopped,
        ];

        it(`Should get events:\n\t ${expectedEvents.join("\n\t ")}`, async () => {
            const server = new ServerMock();
            const client = server.getClient();
            const crawler = mockCrawler();
            const stream = mockCrawlerStream(crawler, [
                (observer) => {
                    observer.next({ // Stream will be finished after first 'next' event.
                        items: [],
                        nextUrl: "/next-page",
                    });
                },
            ]);
            let isStopped = false;
            dispatcher = new SocketDispatcher(server as unknown as io.Server);

            let clientId;
            client.on(events.created, (event: ICrawlerOutData) => {
                clientId = event.id;
            });

            server.emit(events.connect, "data");
            client.emit(events.start, {query: {search: "search"}, type: "google"});

            // Debug state.
            debug({
                "client subscribes": client.getSubscribers(),
                "server events": server.getEvents(),
                "server subscribes": server.getSubscribers(),
            });

            client.on(events.stopped, () => {
                const clientEvents = client.getEvents();

                // Debug events.
                debug({"client events": clientEvents});

                chai.assert.deepEqual( // Invalid it's invalid than flag "isStopped" will not be changed.
                    clientEvents.map((event) => event.event), // Event names.
                    expectedEvents,
                );
                isStopped = true;
            });

            // Stream.
            stream.subscribe({
                error: (error) => {
                    throw error;
                },
                next: () => {
                    const eventData: ICrawlerIncData = {
                        id: clientId,
                        type: null,
                    };
                    client.emit(events.stop, eventData);
                },
            });

            setTimeout(
                () => chai.assert.isTrue(isStopped),
                streamActDelay,
            );
        });
    });

    describe("Invalid event parameters", () => {
        const expectedEvents = [
            events.create,
            events.error,
        ];

        it(`Should get events:\n\t ${expectedEvents.join("\n\t ")}`, async () => {
            const server = new ServerMock();
            const client = server.getClient();
            dispatcher = new SocketDispatcher(server as unknown as io.Server);

            server.emit(events.connect, "data");
            client.emit(events.create, {type: "incorrect type"});
            const clientEvents = client.getEvents();

            // Debug state.
            debug({
                "client subscribes": client.getSubscribers(),
                "server events": server.getEvents(),
                "server subscribes": server.getSubscribers(),
            });

            // Debug events.
            debug({"client events": clientEvents});

            chai.assert.deepEqual(
                clientEvents.map((event) => event.event), // Event names,
                expectedEvents,
            );
        });
    });
});
