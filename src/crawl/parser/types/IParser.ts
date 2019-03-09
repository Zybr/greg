/**
 * Parser.
 */
export interface IParser {
    setContent(content: string): this;

    parse(): Promise<object>;
}
