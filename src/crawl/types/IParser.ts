export interface IParser {
    setContent(content: string): this;

    parse(): Promise<Array<{}>>;
}
