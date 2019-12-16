import faker = require("faker/locale/en");
import {interval} from "rxjs";
import {take} from "rxjs/operators";
import {eventNames as en} from "../../src/crawl/api/event-names";
import {CrawlerFactory} from "../../src/crawl/crawler/CrawlerFactory";

export default class GoogleDispatcher {
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

    private client;

    constructor(client) {
        this.client = client;
    }

    public connect() {
        this.client.on( // On create crawler
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.create}`,
            () => this.createCrawler());

        this.client.on( // On start
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.start}`,
            () => {
                const pageCount = Math.round(10 * Math.random() + 1);
                let stop = false;

                this.startCrawler();

                interval(300) // Stream
                    .pipe(take(pageCount))
                    .subscribe((currentPage) => {
                        if (currentPage >= pageCount - 1 || stop) { // Complete. Finish page.
                            return this.client.emit(
                                `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.complete}`,
                                GoogleDispatcher.createItems(Math.round(10 * Math.random() + 1)),
                            );
                        }

                        this.client.emit( // Next page
                            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.next}`,
                            GoogleDispatcher.createItems(10),
                        );
                    });

                this.client.on( // On stop
                    `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.stop}`,
                    () => {
                        stop = true;
                        this.client.emit(
                            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.stopped}`,
                        );
                    });
            });
    }

    private createCrawler() {
        const id = faker.random.uuid();

        this.client.emit( // Create
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.created}`,
            {
                id,
                type: CrawlerFactory.GOOGLE_CRAWLER,
            },
        );

        return id;
    }

    private startCrawler() {
        this.client.emit( // Start
            `${en.crawler.subject}${en.splitters.action}${en.crawler.actions.started}`,
            {
                id: this.createCrawler(),
            },
        );
    }
}
