import {IDaSelector, IModifier, ISelector} from "./types/selectors";

export class SelectorDecoder {
    /** Delimiter for modifiers. */
    protected readonly MODIFIER_SPLITTER = " | ";

    /** Delimiter for parameters. */
    protected readonly PARAMETER_SPLITTER = " : ";

    /**
     * Decode selector.
     *
     * @param selector
     */
    public disassembleSelector(selector: ISelector | string): IDaSelector {
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
        const query: string[] | string = daSelector.query.split(this.MODIFIER_SPLITTER);

        return {
            modifiers: query
                .slice(1)
                .map((mod) => mod.trim())
                .map((mod) => this.decodeModifier(mod)),
            properties,
            query: query.shift().trim(),
        };
    }

    /**
     * Decode selector modifiers.
     *
     * @param modifier
     */
    private decodeModifier(modifier: string): IModifier {
        const modParams: string[] = modifier
            .split(this.PARAMETER_SPLITTER)
            .map((modParam) => modParam.trim());

        return {
            name: modParams[0],
            parameters: this.decodeParameters(modParams.splice(1)),
        };
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
