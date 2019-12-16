/**
 * Parser.
 */
export abstract class Parser {
    /** Start parsing. */
    public abstract parse(content: string): Promise<object>;
}
