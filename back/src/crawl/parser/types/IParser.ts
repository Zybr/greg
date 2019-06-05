/**
 * Parser.
 */
export interface IParser {
    /** Start parsing. */
    parse(content: string): Promise<object>;
}
