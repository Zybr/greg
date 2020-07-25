import { IDataModifier } from "../types/IDataModifier";
import { IModifier } from "../types/selectors";

/**
 * Modifier for node of document.
 * @deprecated Use DataModifier
 */
export class NodeModifier implements IDataModifier {
    /**
     * Convert.
     */
    public convert(node: null | any, modifiers: IModifier[]): null | string {
        for (const mod of modifiers) {
            if (null === node) { // Skip empty.
                return null;
            }
            if (typeof node[mod.name] === "function") { // Method.
                node = node[mod.name].apply(node, mod.parameters);
            } else if (undefined !== node[mod.name]) { // Property.
                node = node[mod.name];
            } else { // Node defined.
                throw new Error(
                    `Invalid node modifier. Object "${node.constructor.name}"`
                    + ` does not have modifier "${mod.name}".`,
                );
            }
        }

        return node;
    }
}
