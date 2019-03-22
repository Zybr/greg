import {ISelector} from "./ISelector";

/**
 * Map of selectors.
 */
export interface ISelectorsMap {
    [name: string]: string | ISelector;
}
