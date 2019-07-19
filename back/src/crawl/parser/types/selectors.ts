/**
 * Short batch selector.
 */
interface ISelector {
    query: string;
    properties?: {
        [property: string]: string | ISelector,
    };
}

/**
 * Selector modifier.
 */
interface IModifier {
    name: string;
    parameters: any[];
}

/**
 * Disassembled batch selector.
 */
interface IDaSelector {
    query: string;
    properties: {
        [property: string]: IDaSelector,
    };
    modifiers: IModifier[];
}

/**
 * Map of selectors.
 */
interface ISelectorsMap {
    [name: string]: string | ISelector;
}

export {
    ISelector,
    IModifier,
    IDaSelector,
    ISelectorsMap,
};
