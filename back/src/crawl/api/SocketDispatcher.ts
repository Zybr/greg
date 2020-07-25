import io = require("socket.io");
import generateID = require("uuid");
import { CrawlerFactory } from "../crawler/CrawlerFactory";
import { ICrawler } from "../parser/types/ICrawler";
import {
    eventNames as en,
    ICrawlerErrorOutData, ICrawlerIncData,
    ICrawlerNextOutData,
    ICrawlerOutData,
    ICrawlerSearchIncData,
} from "./socket-events";

/**
 * Event dispatcher which listen to sockets and establish conversation between back system and clients.
 */
export class SocketDispatcher {
    /** Server */
    private socketServer: io.Server;

    /** Map [Event subject name => Crawler identifier.] */
    private eventSubjectCrawlers = {};

    /** Connected clients(sockets). */
    private clients: {
        [id: string]: io.Socket,
    } = {};

    /** Crawlers for connected clients. */
    private crawlers: {
        [clientId: string]: {
            [crawlerId: string]: ICrawler; // Socket ID.
        },
    } = {};

    /**
     * @param socketServer
     */
    public constructor(socketServer: io.Server) {
        this.socketServer = socketServer;
        this.eventSubjectCrawlers[`${en.crawler.types.google}${en.splitters.action}`] = CrawlerFactory.GOOGLE_CRAWLER;

        this.setEventsHandlers();
    }

    /**
     * Configure handlers for server events.
     */
    private setEventsHandlers() {
        this.socketServer.on(en.socket.connection, (client) => this.connectClient(client));
        this.socketServer.on(en.socket.disconnect, (client) => this.disconnectClient(client));
    }

    /**
     * Configure conversation with client.
     *
     * @param client
     */
    private connectClient(client: io.Socket) {
        client.on( // On create crawler.
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.create}`,
            (event: ICrawlerSearchIncData) => {
                try {
                    this.createCrawler(client, event);
                } catch (error) {
                    client.emit( // Notify caught error.
                        `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.error}`,
                        {message: error.message},
                    );
                }
            },
        );
        client.on( // On start crawling.
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.start}`,
            (event: ICrawlerSearchIncData) => {
                const crawler = this.defineCrawler(client, event);
                try {
                    crawler.setRequestParameters(event.query);
                    crawler.crawl()
                        .subscribe({
                            complete: () => {
                                const completeData: ICrawlerOutData = {
                                    id: crawler.id,
                                };
                                client.emit(
                                    `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.complete}`,
                                    completeData,
                                );
                            },
                            error: (error) => {
                                const errorData: ICrawlerErrorOutData = {
                                    id: crawler.id,
                                    message: error.message,
                                    stack: error.stack.split("\n"),
                                };
                                console.error(error, error.stack);
                                client.emit(
                                    `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.error}`,
                                    errorData,
                                );
                            },
                            next: (data: { items: object[] }) => {
                                const nextData: ICrawlerNextOutData = {
                                    id: crawler.id,
                                    items: data.items,
                                };
                                client.emit(
                                    `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.next}`,
                                    nextData,
                                );
                            },
                        });

                    // Notify "started".
                    const startedData: ICrawlerOutData = {
                        id: crawler.id,
                    };
                    client.emit(
                        `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.started}`,
                        startedData,
                    );
                } catch (error) {
                    const errorData: ICrawlerErrorOutData = {
                        id: crawler.id,
                        message: error.message,
                        stack: error.stack.split("\n"),
                    };
                    client.emit( // Notify "error"
                        `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.error}`,
                        errorData,
                    );
                }
            },
        );
        client.on( // On stop crawling.
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.stop}`,
            (event: ICrawlerSearchIncData) => {
                try {
                    const crawler = this.getCrawler(client, event);
                    crawler.stop(); // Stop crawling.

                    client.emit(
                        `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.stopped}`,
                        {
                            id: crawler.id,
                        },
                    ); // Notify "stopped"
                } catch (error) {
                    client.emit( // Notify caught error.
                        `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.error}`,
                        {message: error.message},
                    );
                }
            },
        );
    }

    /**
     * Disconnect client.
     *
     * @param client
     */
    private disconnectClient(client: io.Socket) {
        for (const crawlerId in this.crawlers[client.id]) { // Remove crawlers.
            if (!this.crawlers[client.id].hasOwnProperty(crawlerId)) {
                continue;
            }

            this.crawlers[client.id][crawlerId].stop(); // Stop crawling.
            delete this.crawlers[client.id]; // Remove crawler.
        }

        delete this.clients[client.id]; // Remove client.
    }

    /**
     * Get existing or new crawler.
     */
    private defineCrawler(client: io.Socket, event: ICrawlerIncData): ICrawler {
        return this.getCrawler(client, event) || this.createCrawler(client, event);
    }

    /**
     * Get existing crawler.
     *
     * @param client
     * @param event
     */
    private getCrawler(client: io.Socket, event: ICrawlerIncData): ICrawler {
        let crawler: null | ICrawler = null;

        if (event.id) { // Define exist crawler by ID.
            if (!this.crawlers[client.id] || !this.crawlers[client.id][event.id]) {
                throw new Error(`Crawler is not defined by ID "${event.id}"`); // Error "not defined".
            }

            crawler = this.crawlers[client.id][event.id];
        }

        return crawler;
    }

    /**
     * Create new crawler.
     *
     * @param client
     * @param event
     */
    private createCrawler(client: io.Socket, event: ICrawlerIncData): ICrawler {
        if (!event.type || -1 === CrawlerFactory.CRAWLERS.indexOf(event.type)) {
            throw new Error(`Crawler is not defined by type "${event.type}"`); // Error "not defined".
        }

        const crawlerId = generateID();
        this.crawlers[client.id] = this.crawlers[client.id] || {};
        const crawler = this.crawlers[client.id][crawlerId] = CrawlerFactory.getCrawler(event.type);
        crawler.id = crawlerId;

        client.emit( // Notify "created".
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.created}`,
            {
                id: crawlerId,
                type: event.type,
            },
        );

        return crawler;
    }
}
