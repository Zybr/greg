/**
 * Parser.
 */
export interface IParser {
    parse(content: string): Promise<object>;
}
