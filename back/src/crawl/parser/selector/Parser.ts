import cheerio = require("cheerio");
import { Parser as ParserBase } from "../Parser";
import { SelectorDecoder } from "../SelectorDecoder";
import {
    IDaSelector,
    ISelectorsMap,
} from "../types/selectors";
import { NodeModifier } from "./NodeModifier";

/**
 * HTML parser.
 * It uses selectors with formats like jQuery.
 */
export class Parser extends ParserBase {

    /** Modifier for array */
    public static readonly ARRAY_MOD = "[[]]";

    /** Decoder for selectors */
    private readonly selectorDecoder: SelectorDecoder;

    /** Map(tree) of selectors mapped by name. */
    private readonly selectorsMap: ISelectorsMap = {};

    /**
     * Query language.
     * Allow use query(jQuery) language for process document.
     */
    private ql: CheerioStatic;

    /** Converter. */
    private converter: NodeModifier;

    /**
     * Constructor.
     *
     * @param selectorDecoder
     * @param selectorsMap
     */
    public constructor(selectorDecoder: SelectorDecoder, selectorsMap: ISelectorsMap) {
        super();

        this.selectorDecoder = selectorDecoder;
        this.selectorsMap = selectorsMap;
    }

    /**
     * Parser all by set map of selectors.
     *
     * @param content
     */
    public parse(content: string): Promise<object> {
        this.ql = cheerio.load(content, {
            decodeEntities: false,
        });
        this.converter = new NodeModifier(this.ql);

        if (!this.ql) {
            throw Error("Content is not defined.");
        }

        const structure = {};

        // Decode tree of nodes.
        for (const selectorName in this.selectorsMap) {
            if (!this.selectorsMap.hasOwnProperty(selectorName)) {
                continue;
            }

            const selector = this.selectorDecoder.disassembleSelector(this.selectorsMap[selectorName]);
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

        // Process collection of nodes.
        if (selector.modifiers.length && selector.modifiers[0].name === Parser.ARRAY_MOD) {
            if (selector.modifiers[0].parameters.length) { // Node by index.
                const index = parseInt(selector.modifiers[0].parameters[0], 10);
                return this.converter.convert(nodes.eq(index)[0], selector.modifiers.splice(1));
            }

            return nodes.toArray().map((element: CheerioElement) => { // All nodes.
                if (Object.keys(selector.properties).length) {
                    return this.parserNode(element, selector.properties);
                }

                return this.converter.convert(element, selector.modifiers.splice(1));
            });
        } else { // Process node.
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
}
