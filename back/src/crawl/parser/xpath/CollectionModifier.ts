import {IDataModifier} from "../types/IDataModifier";
import {IModifier} from "../types/selectors";

/**
 * Modifier for node of document.
 */
export class CollectionModifier implements IDataModifier {

    /**
     * Convert.
     */
    public convert(collection: any[], modifiers: IModifier[]): any {
        for (const mod of modifiers) {
            if (typeof collection[mod.name] === "function") {
                collection = collection[mod.name].apply(collection, mod.parameters);
            } else {
                throw new Error(
                    `Invalid node modifier. Object "${collection.constructor.name}"`
                    + ` does not have modifier "${mod.name}".`,
                );
            }
        }

        return collection;
    }
}
