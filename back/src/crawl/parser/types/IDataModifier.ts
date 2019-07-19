import {IModifier} from "./selectors";

/**
 * Modifier of selector.
 * It converts, fetches and transforms data from nodes.
 */
export abstract class IDataModifier {
    /**
     * Apply modifiers for fetched node.
     *
     * @param data
     * @param modifiers
     */
    public abstract convert(data: any, modifiers: IModifier[]): any;
}
