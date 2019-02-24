export interface IParser {
    setContent(content: string): this;

    parseItems(): Promise<Array<{}>>;
}
