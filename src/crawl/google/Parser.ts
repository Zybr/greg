import cheerio from "cheerio";
import {hasOwnProperty} from "tslint/lib/utils";
import {select} from "xpath";
import {BatchSelector} from "../types/BatchSelector";
import {IParser} from "../types/IParser";

export class Parser implements IParser {
    public content: CheerioStatic;

    private config: BatchSelector = {
        properties: {
            "items[]": {
                properties: {
                    link: "a | [href]",
                    snippet: "snippet | html",
                    title: "h3 | text",
                },
                selector: "div",
            },
            "nextPage": {
                selector: "div.navigation > a",
            },
        },
        selector: "body",
    };

    public setContent(content: string): this {
        this.content = cheerio.load(content);

        return this;
    }

    // public parse(): Promise<Array<{}>> {
    //     if (!this.content) {
    //         throw Error("Content is not defined.");
    //     }
    //
    //     let items: any[] = this.content("#rso").find("> div > div > div").toArray();
    //     items = items.map((node: Node) => this.parserItem(node));
    //
    //     return Promise.resolve(items);
    // }

    public parse(): Promise<Array<{}>> {
        if (!this.content) {
            throw Error("Content is not defined.");
        }

        const rootNode: CheerioElement = this.content(this.config.selector).toArray()[0];

        const items: any = this.parserNode(rootNode, this.config);

        return Promise.resolve(items);
    }

    private parserNode(parentNode: Node | CheerioElement, batchSel: BatchSelector): string | {} {
        const node = this.content(parentNode).find(batchSel.selector);

        if (Object.hasOwnProperty.call(batchSel, "properties")) {
            const item = {};

            for (const name in batchSel.properties) {
                if (!batchSel.properties.hasOwnProperty(name)) {
                    continue;
                }

                let sel = batchSel.properties[name];

                sel = (sel instanceof BatchSelector) ? sel : {
                    selector: sel,
                };

                const subBatchSel = (sel)
                    ? {selector: "" + sel}
                    : sel;
                item[name] = this.parserNode(node.toArray()[0], subBatchSel);
            }
        } else {
            return node.text();
        }
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
