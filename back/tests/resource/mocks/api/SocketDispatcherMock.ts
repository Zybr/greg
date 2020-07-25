import faker = require("faker/locale/en");
import io = require("socket.io");
import { eventNames as en } from "../../../../src/crawl/api/event-names";
import { CrawlerFactory } from "../../../../src/crawl/crawler/CrawlerFactory";

export default class SocketDispatcherMock {
    private static createItems(size = 10) {
        const items = [];

        for (let i = 0; i < size; i++) {
            items.push({
                snippet: faker.lorem.words(7, 15),
                title: faker.lorem.words(3, 6),
                url: faker.internet.url(),
            });
        }

        return items;
    }

    private crawlerId = null;

    private server: io.Server;

    constructor(server: io.Server) {
        this.server = server;
    }

    public connect() {
        let stop = false;

        this.server.on( // On create crawler
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.create}`,
            () => this.createCrawler());

        this.server.on( // On start
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.start}`,
            () => {
                const pageCount = Math.round(10 * Math.random() + 1);

                let currentPage = 0;
                stop = false;
                this.startCrawler();

                const timer = setInterval(() => {
                        currentPage++;
                        if (currentPage >= pageCount || stop) { // Complete. Finish page.
                            clearInterval(timer);
                            return this.server.emit(
                                `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.complete}`,
                                {
                                    id: this.crawlerId,
                                    items: SocketDispatcherMock.createItems(Math.round(10 * Math.random() + 1)),
                                },
                            );
                        }

                        this.server.emit( // Next page
                            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.next}`,
                            {
                                id: this.crawlerId,
                                items: SocketDispatcherMock.createItems(10),
                            },
                        );
                    },
                    300,
                );

            });

        this.server.on( // On stop
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.stop}`,
            () => {
                stop = true;
                this.server.emit(
                    `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.stopped}`,
                    {
                        id: this.crawlerId,
                    },
                );
            });
    }

    private createCrawler() {
        this.crawlerId = faker.random.uuid();

        this.server.emit( // Create
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.created}`,
            {
                id: this.crawlerId,
                type: CrawlerFactory.GOOGLE_CRAWLER,
            },
        );
    }

    private startCrawler() {
        if (null === this.crawlerId) {
            this.createCrawler();
        }

        this.server.emit( // Start
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.started}`,
            {
                id: this.crawlerId,
            },
        );
    }
}
