/**
 * Convert fetch and transform data from nodes.
 */
import * as Cheerio from "cheerio";
import {isCheerio} from "./types/CheerioDetector";
import {IModifier} from "./types/html-selectors/IModifier";

export class NodeModifier {
    /**
     * Query language.
     * Allow use query(jQuery) language for process document.
     */
    private readonly ql: CheerioStatic;

    /**
     * Name of modifiers which can apply to element.
     */
    private readonly QL_MODS = ["first", "html", "text", "attr", "last"];

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
     * Apply modifiers for fetched node.
     *
     * @param element
     * @param modifiers
     */
    public convert(element: CheerioElement, modifiers: IModifier[]): null | string {
        let elem: Cheerio | CheerioStatic | string = this.ql(element);

        for (const mod of modifiers) {
            const modName = mod.name;
            // const parameters = mod.parameters);
            const parameters = this.decodeParameters(mod.parameters);

            switch (modName) {
                case "match" :
                    if (typeof elem !== "string") {
                        break;
                    }

                    elem = "".match.apply(elem, parameters);
                    continue;
                case "replace" :
                    if (typeof elem !== "string") {
                        break;
                    }

                    elem = "".replace.apply(elem, parameters);
                    continue;
                default:
                    if ((isCheerio(elem)) && this.QL_MODS.indexOf(modName) !== -1) { // Cheerio modifier.
                        if (typeof elem[modName] === "function") {
                            elem = elem[modName].apply(elem, parameters);
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

    /**
     * Decode modifier parameters.
     *
     * @param parameters
     */
    private decodeParameters(parameters: string[]): Array<string | RegExp> {
        return parameters.map((param) => {
            if (param.charAt(0) === "/") { // Create regular expression.
                // Parser parameters.
                const reArgs = /\/(.+)\/([^\/]+?)?$/;
                const args = param.match(reArgs);
                // Create by parameters.
                return new RegExp(args[1], args[2] || null);
            } else {
                return param.replace(/(^["'])|(["']$)/g, ""); // Trim quotes.
            }
        });
    }
}
