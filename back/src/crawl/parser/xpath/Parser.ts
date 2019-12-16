import xpath = require("xpath");
import {Parser as ParserBase} from "../Parser";
import {SelectorDecoder} from "../SelectorDecoder";
import {IDaSelector, ISelectorsMap} from "../types/selectors";
import {DataModifier} from "./DataModifier";
import {XmlConverter} from "./XmlConverter";

/**
 * HTML parser.
 * It uses XPath selectors.
 */
export class Parser extends ParserBase {

    /** Data types which should not be simplified. */
    private NOT_TEXT_TYPES = ["Object", "Array", "Boolean"];

    /**
     * XML converter.
     * It converts source HTML to XML.
     */
    private readonly xmlConverter: XmlConverter;

    /**
     * Data(node / node collection) modifier.
     * It allow apply modifiers for node.
     */
    private readonly dataModifier: DataModifier;

    /** Decoder for selectors */
    private readonly selectorDecoder: SelectorDecoder;

    /** Map(tree) of selectors mapped by name. */
    private readonly selectorsMap: ISelectorsMap = {};

    /**
     * Constructor.
     *
     * @param xmlConverter
     * @param selectorDecoder
     * @param dataModifier
     * @param selectorsMap
     */
    public constructor(
        xmlConverter: XmlConverter,
        selectorDecoder: SelectorDecoder,
        dataModifier: DataModifier,
        selectorsMap: ISelectorsMap,
    ) {
        super();

        this.dataModifier = dataModifier;
        this.xmlConverter = xmlConverter;
        this.selectorDecoder = selectorDecoder;
        this.selectorsMap = selectorsMap;
    }

    /**
     * Fetch data from markup by map of selectors.
     *
     * @param content
     */
    public parse(content: string): Promise<object> {
        const structure = {};

        // Decode tree of nodes.
        for (const selectorName in this.selectorsMap) {
            if (!this.selectorsMap.hasOwnProperty(selectorName)) {
                continue;
            }

            const selector = this.selectorDecoder.disassembleSelector(this.selectorsMap[selectorName]);
            structure[selectorName] = this.parserNodes(content, selector);
        }

        return Promise.resolve(this.simplifyStructure(structure) as object);
    }

    /**
     * Fetch nodes form HTML by XPath selector.
     *
     * @param html
     * @param xpathSelector
     */
    private select(html: string, xpathSelector: string): any[] {
        return xpath.select(xpathSelector, this.xmlConverter.htmlToXmlDoc(html));
    }

    /**
     * Parser markup.
     *
     * @param markup
     * @param selector
     */
    private parserNodes(markup: string, selector: IDaSelector): string | {} {
        let collection: any[] = this.select(markup, selector.query); // Fetch nodes.
        collection = this.dataModifier.convert(collection, selector.modifiers); // Apply modifiers for nodes.

        return (Array.isArray(collection)) // After modification result can be still collection or single node.
            ? collection // Parse each item of collection.
                .map((node: any) => this.parserNode(node, selector))
            : this.parserNode(collection, selector); // Parser node.
    }

    /**
     * Parse single node.
     *
     * @param node
     * @param selector
     */
    private parserNode(node, selector: IDaSelector): {} {
        if (Object.keys(selector.properties).length) { // Go deep in structure.
            const structure = {};

            for (const subSelectorName in selector.properties) {
                if (!selector.properties.hasOwnProperty(subSelectorName)) {
                    continue;
                }

                let subProp: any = selector.properties[subSelectorName];
                subProp = (undefined === subProp.query) // Convert query string to selector.
                    ? {query: subProp}
                    : subProp;
                structure[subSelectorName] = this.parserNodes(node.toString(), subProp);
            }

            return structure;
        }

        return node;
    }

    /**
     * Convert complex inner structure to string.
     * @param structure
     */
    private simplifyStructure(structure: {}): {} | string {
        if (!structure) {
            return null;
        }

        if (-1 === this.NOT_TEXT_TYPES.indexOf(structure.constructor.name)) { // Complex structure convert to string.
            return "" + structure;
        }

        for (const key in structure) { // Simplify each property.
            if (structure.hasOwnProperty(key)) {
                structure[key] = null === structure[key] ? null : this.simplifyStructure(structure[key]);
            }
        }

        return structure;
    }
}
