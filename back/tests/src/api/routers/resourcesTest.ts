import faker = require("faker/locale/en");
import httpConst = require("http-const");
import hsc = require("http-status-codes");
import { IResource } from "../../../../src/database/models/Resource";
import Client from "../resources/http/Client";
import { resourceListSchema, resourceSchema } from "../resources/schemas";

const client = new Client();
const fetchModels = () => client.get("/resources")
    .send()
    .then((res) => res.body.data);
const hmt = httpConst.methods;

describe("routers/resources", () => {
    let models: IResource[];
    let modelIds: string[];
    let mapIds: string[];
    let invalidIdUrl = "";
    let modelData;

    before(async () => {
        modelIds = await fetchModels()
            .then((resources) => models = resources)
            .then((resources) => resources.map((resource) => resource.id));
        mapIds = (await client.get("/maps")
            .send())
            .body.data
            .map((model) => model.id);
        modelData = {
            map: mapIds.shift(),
            name: faker.lorem.words(),
            parameters: {
                [faker.lorem.word()]: faker.lorem.word(),
            },
            url: faker.internet.url(),
        };
        invalidIdUrl = `/resources/${(modelIds[0]).replace(/./, "0")}`;
    });

    describe("GET /resources", () => {
        it("Return list of resource.", async () => {
            (await client.get("/resources")
                .send())
                .assertStatus(hsc.OK)
                .assertBodySchema(resourceListSchema);
        });
    });

    describe("GET /resources/:id", () => {
        it("Return a resource.", async () => {
            (await client.get(`/resources/${modelIds.shift()}`)
                .send())
                .assertStatus(hsc.OK)
                .assertBodySchema(resourceSchema);
        });
    });

    describe("POST /resources", () => {
        it("Create a resource.", async () => {
            const createData = (await client.post(`/resources`)
                .send({
                    ...modelData,
                    ...{name: faker.lorem.words(2)},
                }))
                .assertStatus(hsc.CREATED)
                .assertBodySchema(resourceSchema)
                .body;
            createData.map.id.should.be.equal(modelData.map); // Check map
            createData.parameters.should.be.deep.equal(modelData.parameters); // Check parameters
            // Check that model was create
            (await client.get(`/resources/${createData.id}`)
                .send())
                .assertStatus(hsc.OK);
        });
    });

    describe("PUT /resources", () => {
        it("Return updated resource.", async () => {
            const id = modelIds.shift();
            const updatedData = (await client.put(`/resources/${id}`)
                .send({
                    ...modelData,
                    ...{name: faker.lorem.words(3)},
                }))
                .assertStatus(hsc.OK)
                .assertBodySchema(resourceSchema)
                .body;
            updatedData.map.id.should.be.equal(modelData.map); // Check map
            updatedData.parameters.should.be.deep.equal(modelData.parameters); // Check parameters
        });
    });

    describe("DELETE /resources:id", () => {
        it("Remove resource.", async () => {
            const id = modelIds.shift();
            (await client.get(`/resources/${id}`)
                .send())
                .assertStatus(hsc.OK);
            (await client.delete(`/resources/${id}`)
                .send())
                .assertStatus(hsc.OK);
            (await client.get(`/resources/${id}`)
                .send())
                .assertStatus(hsc.NOT_FOUND);
        });
    });

    describe("Negative. Empty params.", () => {
        [
            {
                method: hmt.post,
                path: "/resources",
            },
            {
                method: hmt.put,
                path: `/resources/{id}`,
            },
        ]
            .forEach((params) => {
                it(`Return "${hsc.NOT_FOUND}" on ${params.method} with empty body.`, async () => {
                    (await client.crateRequest(params.path.replace("{id}", modelIds[0]), params.method as any)
                        .send())
                        .assertIsBadRequest();
                });
            });
    });

    describe("Negative. Invalid model ID.", () => {
        [
            {
                method: hmt.get,
                status: hsc.NOT_FOUND,
            },
            {
                method: hmt.put,
                status: hsc.NOT_FOUND,
            },
            {
                method: hmt.del,
                status: hsc.OK,
            },
        ]
            .forEach((params) => {
                it(`Return "${params.status}" on ${params.method} by invalid ID.`, async () => {
                    (await client.crateRequest(invalidIdUrl, params.method)
                        .send())
                        .assertStatus(params.status);
                });
            });
    });

    describe('Negative. Property "parameters".', () => {
        ["string", {key: []}, {key: {}}].forEach((value) => {
            it(`Return "${hsc.BAD_REQUEST}" on POST with ${JSON.stringify(value)} "parameters" value`,
                async () => {
                    (await client.post(`/resources`)
                        .send({...modelData, ...{parameters: value}}))
                        .assertIsBadRequest("parameters");
                });
        });
    });

    describe("Negative. Invalid property values.", async () => {
        [
            {value: null, valueType: "NULL"},
            {value: {}, valueType: "Object"},
            {value: [], valueType: "Array"},
            {value: (() => (fetchModels()).then((ms) => ms[0].name)), valueType: "[duplicate]"},
        ].map((params) => ({...params, name: "name"}))
            .forEach((prop) => {
                it(`Return "${hsc.BAD_REQUEST}" on POST with ${prop.valueType} value`, async () => {
                    (await client.post(`/resources`)
                        .send({
                            ...modelData, ...{
                                [prop.name]: (typeof prop.value === "function") ? await prop.value() : prop.value,
                            },
                        }))
                        .assertIsBadRequest(`${prop.name}:`);
                });
            });
    });
});
