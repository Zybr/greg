import cheerio from "cheerio";
import {DOMParser} from "xmldom";
import {select} from "xpath";
import {IParser} from "./types/IParser";

class XPathParser implements IParser {
    private content: DOMParser;

    // private config: object = {
    //     "items[]": {
    //         fields: {
    //             link: "a | [href]",
    //             snippet: "snippet | html",
    //             title: "h3 | text",
    //         },
    //         query: "div",
    //     },
    //     "nextPage": {
    //         query: "div.navigation > a",
    //     },
    // };

    public setContent(content: string): this {
        // this.query = new dom().parserF
        // query = "<book><title>Harry Potter</title></book>";
        const doc = new DOMParser().parseFromString(content, null);
        // const doc = new DOMParser().parseFromString(query, "text/xml");
        this.content = doc;

        // this.test();
        return this;
    }

    // public setConfig(config: object): this {
    //     this.config = config;
    //
    //     return this;
    //
    // }

    // public test() {
    //     const xml = "<book><title>Harry Potter</title></book>";
    //     const doc = new DOMParser().parseFromString(xml);
    //     const nodes = select("//title", doc);
    //
    //     console.log("Node: " + nodes[0].toString());
    // }

    public parse(): Promise<Array<{}>> {
        if (!this.content) {
            throw Error("Content is not defined.");
        }

        const items: any[] = select("//*[@id=\"rso\"]/div/div/div", this.content);
        // let items: any[] = this.query("#rso").find("> div > div > div").toArray();
        // items.every((item, index, array) => {
        //     item = this.parserItem(item);
        // });
        const values = [];
        items.forEach((item) => {
            // items.((node: Element) => this.parserItem(node));
            values.push(this.parserItem(item));
        });
        // items = items.map((node: Element) => this.parserItem(node));
        return Promise.resolve(items);
    }

    private parserItem(node: Element) {
        // const node = this.query(node);
        const title = select("//*/h3[1]/text()[1]", node, true);
        const link = select("//*/div/div/div[1]/a[1]/@href", node, true);
        const snippet = select("*/div/div/div[2]/div/span/text()[1]", node, true);

        const item = {
            link: link ? link.toString() : null,
            snippet: snippet ? snippet.toString() : null,
            title: title ? title.toString() : null,
        };

        return item;
    }
}
