import chai = require("chai");
import { should } from "chai";
import chaiSpies = require("chai-spies");
import mongoose = require("mongoose");

chai.use(chaiSpies);
should();

describe("DB", () => {
    describe("Initialize", () => {
        it("Give DB", () => {
            import("../../../src/database/db").then((params) => {
                params.default.connection.should.be.an.instanceOf(mongoose.connection.constructor);
            });
        });
    });
});
