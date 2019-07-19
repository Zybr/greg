import {IDataModifier} from "../types/IDataModifier";
import {IModifier} from "../types/selectors";

/**
 * Modifier for node/node-collection of document.
 */
export class DataModifier implements IDataModifier {
    /**
     * Prefix for modifiers of each item of collection.
     */
    public readonly ITEM_MOD_PREFIX = "[]";

    /**
     * Convert. Apply list of modifiers.
     */
    public convert(data: null | any, modifiers: IModifier[]): any {
        for (const mod of modifiers) {
            if (null === data) { // Skip empty.
                return null;
            }

            if (0 === mod.name.indexOf(this.ITEM_MOD_PREFIX)) {
                if (!Array.isArray(data)) {
                    throw new Error(
                        `Invalid item modifier. Object "${data.constructor.name}"`
                        + ` is not collection. It does not have modifier "${mod.name}".`,
                    );
                }

                const itemMod = Object.assign({}, mod);
                itemMod.name = itemMod.name.substring(this.ITEM_MOD_PREFIX.length);

                data = data.map((item) => this.convert(item, [itemMod]));
            } else {
                if (typeof data[mod.name] === "function") { // Method.
                    data = data[mod.name].apply(data, mod.parameters);
                } else if (undefined !== data[mod.name]) { // Property.
                    data = data[mod.name];
                } else { // Node defined.
                    throw new Error(
                        `Invalid data modifier. Object "${data.constructor.name}"`
                        + ` does not have modifier "${mod.name}".`,
                    );
                }
            }

        }

        return data;
    }
}
