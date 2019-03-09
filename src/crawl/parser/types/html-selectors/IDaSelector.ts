import {IModifier} from "./IModifier";

/**
 * Disassembled batch selector.
 */
export interface IDaSelector {
    query: string;
    properties: {
        [property: string]: IDaSelector,
    };
    modifiers: IModifier[];
}
