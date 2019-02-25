import cheerio from "cheerio";
import {IParser} from "../types/IParser";

export class Parser implements IParser {
    private content: CheerioStatic;

    // private config: object = {
    //     "items[]": {
    //         fields: {
    //             link: "a | [href]",
    //             snippet: "snippet | html",
    //             title: "h3 | text",
    //         },
    //         selector: "div",
    //     },
    //     "nextPage": {
    //         selector: "div.navigation > a",
    //     },
    // };

    public setContent(content: string): this {
        this.content = cheerio.load(content);

        return this;
    }

    // public setConfig(config: object): this {
    //     this.config = config;
    //
    //     return this;
    //
    // }

    public parse(): Promise<Array<{}>> {
        if (!this.content) {
            throw Error("Content is not defined.");
        }

        let items: any[] = this.content("#rso").find("> div > div > div").toArray();
        items = items.map((node: Node) => this.parserItem(node));

        return Promise.resolve(items);
    }

    private parserItem(node: Node) {
        const $node = this.content(node);
        const title = $node.find("h3");
        const link = $node.find("div.r > a");
        const snippet = $node.find("div.s > div > span");

        return {
            link: link.attr("href"),
            snippet: snippet.text(),
            title: title.text(),
        };
    }
}
