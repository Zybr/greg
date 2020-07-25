import { should } from "chai";
import { Colorizer } from "../../../../src/core/Colorizer";
import { SelectorDecoder } from "../../../../src/crawl/parser/SelectorDecoder";
import { IDaSelector, ISelector } from "../../../../src/crawl/parser/types/selectors";
import { getDebugger } from "../../../resource/src/debugger";

const debug = getDebugger("test:types:parser");

should();
Colorizer.color();

describe("SelectorDecoder", () => {
    const decoder = new SelectorDecoder();
    const selector: ISelector = {
        properties: {
            nodeCollection: ".list > a | splice : 2 | shift | text | replace : a : b",
        },
        query: ".text-list",
    };

    describe(".disassembleSelectors()", () => {
        it("Should decode selector.", async () => {
            debug({selector});
            const daSelector: IDaSelector = decoder.disassembleSelector(selector);
            debug({daSelector});

            // .query
            daSelector.query.should.be.equal(".text-list");

            // .properties.nodeCollection
            daSelector.properties.should.have.property("nodeCollection");
            daSelector.properties.nodeCollection.query.should.equal(".list > a");
            daSelector.properties.nodeCollection.modifiers.should.have.length(4);

            // .properties.nodeCollection.modifiers[0]
            daSelector.properties.nodeCollection.modifiers[0].name.should.equal("splice");
            daSelector.properties.nodeCollection.modifiers[0].parameters.should.have.length(1);
            daSelector.properties.nodeCollection.modifiers[0].parameters[0].should.equal("2");

            // .properties.nodeCollection.modifiers[1]
            daSelector.properties.nodeCollection.modifiers[1].name.should.equal("shift");
            daSelector.properties.nodeCollection.modifiers[1].parameters.should.have.length(0);

            // .properties.nodeCollection.modifiers[2]
            daSelector.properties.nodeCollection.modifiers[2].name.should.equal("text");
            daSelector.properties.nodeCollection.modifiers[2].parameters.should.have.length(0);

            // .properties.nodeCollection.modifiers[3]
            daSelector.properties.nodeCollection.modifiers[3].name.should.equal("replace");
            daSelector.properties.nodeCollection.modifiers[3].parameters.should.have.length(2);
            daSelector.properties.nodeCollection.modifiers[3].parameters[0].should.equal("a");
            daSelector.properties.nodeCollection.modifiers[3].parameters[1].should.equal("b");
        });
    });
});
