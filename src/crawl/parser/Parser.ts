import cheerio from "cheerio";
import * as Cheerio from "cheerio";
import {NodeModifier} from "./NodeModifier";
import {IDaSelector} from "./types/html-selectors/IDaSelector";
import {ISelector} from "./types/html-selectors/ISelector";
import {ISelectorsMap} from "./types/html-selectors/ISelectorsMap";
import {IParser} from "./types/IParser";

/**
 * HTML parser.
 * It fetch specific data from markup.
 */
export class Parser implements IParser {
    /**
     * Query language.
     * Allow use query(jQuery) language for process document.
     */
    private ql: CheerioStatic;

    /**
     * Converter.
     */
    private converter: NodeModifier;

    /**
     * Delimiter for modifiers.
     */
    private readonly MODIFIER_SPLITTER = "|";

    /**
     * Map(tree) of selectors mapped by name.
     */
    private selectorsMap: ISelectorsMap;

    /**
     * Set target content.
     *
     * @param content
     */
    public setContent(content: string): this {
        this.ql = cheerio.load(content, {
            decodeEntities: false,
        });

        this.converter = new NodeModifier(this.ql);

        return this;
    }

    /**
     * Set map of selectors.
     *
     * @param selectorsMap
     */
    public setSelectorMap(selectorsMap: ISelectorsMap) {
        this.selectorsMap = selectorsMap;
    }

    /**
     * Parser all by set map of selectors.
     */
    public parse(): Promise<object> {
        if (!this.ql) {
            throw Error("Content is not defined.");
        }

        const structure = {};

        // Decode tree of nodes.
        for (const selectorName in this.selectorsMap) {
            if (!this.selectorsMap.hasOwnProperty(selectorName)) {
                continue;
            }

            const selector = this.disassembleSelector(this.selectorsMap[selectorName]);
            structure[selectorName] = this.parserNodes(selector);
        }

        return Promise.resolve(structure);
    }

    /**
     * Parser each nodes in selector.
     *
     * @param selector
     * @param parentNode
     */
    private parserNodes(selector: IDaSelector, parentNode: Cheerio = null): string | {} {
        let nodes: Cheerio | Array<{}>;

        // Fetch nodes

        if (null !== parentNode) {
            nodes = parentNode.find(selector.query);
        } else {
            nodes = this.ql(selector.query);
        }

        if (selector.modifiers.length && selector.modifiers[0].name === "[]") { // Process single node.
            return nodes.toArray().map((element: CheerioElement) => {
                if (Object.keys(selector.properties).length) {
                    return this.parserNode(element, selector.properties);
                }

                return this.converter.convert(element, selector.modifiers.splice(1));
            });
        } else { // Process collection of nodes.
            const element = nodes.first()[0];

            if (Object.keys(selector.properties).length && selector.modifiers.length) {
                throw new Error("Modifiers can be apply only for finite node.");
            }

            if (Object.keys(selector.properties).length) {
                return this.parserNode(element, selector.properties);
            }

            return (element) ? this.converter.convert(element, selector.modifiers) : null;
        }
    }

    /**
     * Parse single node.
     *
     * @param element
     * @param properties
     */
    private parserNode(element: CheerioElement, properties: { [name: string]: IDaSelector }): {} {
        const structure = {};

        for (const subSelectorName in properties) {
            if (!properties.hasOwnProperty(subSelectorName)) {
                continue;
            }

            let subProp: any = properties[subSelectorName];
            subProp = (undefined === subProp.query) // Convert query string to selector.
                ? {query: subProp}
                : subProp;
            structure[subSelectorName] = this.parserNodes(subProp, this.ql(element));
        }

        return structure;
    }

    /**
     * Decode short variant of selector.
     *
     * @param selector
     */
    private disassembleSelector(selector: ISelector | string): IDaSelector {
        const properties = {};
        const daSelector: ISelector = (typeof selector === "string")
            ? {query: selector}
            : selector;

        // Decode property selectors
        if (daSelector.properties) {
            for (const subSelectorName in daSelector.properties) {
                if (!daSelector.properties.hasOwnProperty(subSelectorName)) {
                    continue;
                }

                let subSelector: any = daSelector.properties[subSelectorName];

                // Convert string to query
                subSelector = (undefined === subSelector.query)
                    ? {query: subSelector}
                    : subSelector;

                properties[subSelectorName] = this.disassembleSelector(subSelector);
            }
        }

        // Decode query and modifiers
        let query: string[] | string = daSelector.query.split(this.MODIFIER_SPLITTER);
        const modifiers = query.slice(1)
            .map((modString) => {
                const modParams: string[] = modString
                    .split(":")
                    .map((modParam) => modParam.trim());
                return {
                    name: modParams[0],
                    parameters: modParams.splice(1),
                };
            });
        query = query.shift();

        return {
            modifiers,
            properties,
            query,
        };
    }

}
