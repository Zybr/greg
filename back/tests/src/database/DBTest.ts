import chai = require("chai");
import { should } from "chai";
import chaiSpies = require("chai-spies");
import mongoose = require("mongoose");

chai.use(chaiSpies);
should();

describe("DB", () => {
    describe("Initialize", () => {
        it("Should give DB", () => {
            import("../../../src/database/DB").then((params) => {
                params.default.connection.should.be.an.instanceOf(mongoose.connection.constructor);
            });
        });
    });
});
