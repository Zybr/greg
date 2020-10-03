import * as chai from "chai";
import { should } from "chai";
import chaiString = require("chai-string");
import { Colorizer } from "../../../../../src/core/Colorizer";
import { IModifier } from "../../../../../src/crawl/parser/types/selectors";
import { NodeModifier } from "../../../../../src/crawl/parser/xpath/NodeModifier";
import { createDebugger } from "../../../../resource/src/debugger";

const debug = createDebugger("test:xpath:node-modifier");

chai.use(chaiString);
should();
Colorizer.color();

describe("xpath/DataModifier", () => {
    const nodeModifier = new NodeModifier();
    const modifiers: IModifier[] = [
        {
            name: "slice",
            parameters: [2, 8],
        },
        {
            name: "toString",
            parameters: [],
        },
        {
            name: "replace",
            parameters: ["4,5", "9"],
        },
    ];
    const node = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    describe(".convert()", () => {
        it("Apply modifiers to node.", async () => {
            debug({node, modifiers});
            const result = nodeModifier.convert(node, modifiers);
            debug({result});
            result.should.be.equals("2,3,9,6,7");
        });
    });
});
