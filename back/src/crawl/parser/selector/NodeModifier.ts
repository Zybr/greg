import * as Cheerio from "cheerio";
import {isCheerio} from "../types/CheerioDetector";
import {IDataModifier} from "../types/IDataModifier";
import {IModifier} from "../types/selectors";

/**
 * Modifier for node of document.
 */
export class NodeModifier implements IDataModifier {
    /**
     * Query language.
     * Allow use query(jQuery) language for process document.
     */
    private readonly ql: CheerioStatic;

    /** Name of modifiers which can apply to node. */
    private readonly MODS = ["first", "html", "text", "attr", "last"];

    /**
     * Constructor.
     *
     * @param queryLanguage
     */
    public constructor(queryLanguage: CheerioStatic) {
        /**
         * Query language.
         */
        this.ql = queryLanguage;
    }

    /**
     * Convert.
     */
    public convert(node: CheerioElement, modifiers: IModifier[]): null | string {
        let elem: Cheerio | CheerioStatic | string = this.ql(node);

        for (const mod of modifiers) {
            const modName = mod.name;

            switch (modName) {
                case "match" :
                    if (typeof elem !== "string") {
                        break;
                    }

                    elem = "".match.apply(elem, mod.parameters);
                    continue;
                case "replace" :
                    if (typeof elem !== "string") {
                        break;
                    }

                    elem = "".replace.apply(elem, mod.parameters);
                    continue;
                default:
                    if ((isCheerio(elem)) && this.MODS.indexOf(modName) !== -1) { // Cheerio modifier.
                        if (typeof elem[modName] === "function") {
                            elem = elem[modName].apply(elem, mod.parameters);
                            continue;
                        }
                    }
            }

            // Invalid modifier.
            throw new Error(
                `Invalid node modifier. Object "${elem.constructor.name}"`
                + ` does not have modifier "${modName}".`,
            );

        }

        // Typify result.

        if (null === elem || undefined === elem) {
            return null;
        }

        if ((isCheerio(elem))) {
            return elem = elem.html();
        }

        return (elem.toString) ? elem.toString() : typeof elem;
    }
}
