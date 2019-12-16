import * as chai from "chai";
import {should} from "chai";
import chaiString = require("chai-string");
import {Colorizer} from "../../../../../src/core/Colorizer";
import {IModifier} from "../../../../../src/crawl/parser/types/selectors";
import {DataModifier} from "../../../../../src/crawl/parser/xpath/DataModifier";
import {getDebugger} from "../../../../resource/src/debugger";

const debug = getDebugger("test:xpath:node-modifier");

chai.use(chaiString);
should();
Colorizer.color();

describe("xpath/DataModifier", () => {
    const dataModifier = new DataModifier();
    const modifiers: IModifier[] = [
        {
            name: "slice",
            parameters: [1, 9],
        },
        {
            name: "toString",
            parameters: [],
        },
        {
            name: "split",
            parameters: [","],
        },
        {
            name: "slice",
            parameters: [1, 6],
        },
        {
            name: "[]repeat", // Apply modifier for each element.
            parameters: [2],
        },
        {
            name: "join",
            parameters: [","],
        },
        {
            name: "replace",
            parameters: ["33,44", "A"],
        },
    ];
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    describe(".convert()", () => {
        it("Should apply modifiers to data.", async () => {
            debug({data, modifiers});
            const result = dataModifier.convert(data, modifiers);
            debug({result});
            result.should.be.equals("22,A,55,66");
        });
    });
});
