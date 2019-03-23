/**
 * Short batch selector.
 */
export interface ISelector {
    query: string;
    properties?: {
        [property: string]: string | ISelector,
    };
}
