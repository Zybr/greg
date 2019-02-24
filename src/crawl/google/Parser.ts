import cheerio from "cheerio";
import {IParser} from "../types/IParser";

export class Parser implements IParser {
    private content;

    public setContent(content: string): this {
        this.content = cheerio.load(content);

        return this;
    }

    public parseItems(): Promise<Array<{}>> {
        const items =  this.content("#rso > div > div > div").html();
        //
        return Promise.resolve([{}]);
    }
}
