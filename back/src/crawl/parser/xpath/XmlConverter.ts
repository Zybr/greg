import { parse } from "parse5";
import { DOMParser } from "xmldom";
import { serializeToString } from "xmlserializer";

/**
 * XML converter.
 */
export class XmlConverter {

    /** Pattern for attribute of namespace */
    private readonly NAMESPACE_ATTR = /xmlns=".+?"/;

    /**
     * Convert HTML markup to XML document.
     *
     * @param html
     */
    public htmlToXmlDoc(html: string): Document {
        const htmlDoc = parse(html);
        const xhtml = serializeToString(htmlDoc)
            .replace(this.NAMESPACE_ATTR, "");
        return (new DOMParser()).parseFromString(xhtml);
    }
}
