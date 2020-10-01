import faker = require("faker/locale/en");
import httpConst = require("http-const");
import hsc = require("http-status-codes");
import Client from "../resources/http/Client";
import { mapListSchema, mapSchema } from "../resources/schemas";

const client = new Client();
const hmt = httpConst.methods;
const fetchModels = () => client.get("/maps")
    .send()
    .then((res) => res.body.data);

describe("routers/maps", () => {
    let modelIds: string[];
    let invalidIdUrl = "";
    let modelData;

    before(async () => {
        modelIds = (await fetchModels())
            .map((model) => model.id);
        modelData = {
            name: faker.lorem.words(),
            structure: faker.lorem.words(100),
        };
        invalidIdUrl = `/maps/${(modelIds[0]).replace(/./, "0")}`;
    });

    describe("GET /maps", () => {
        it("Return list of maps.", async () => {
            (await client.get("/maps")
                .send())
                .assertStatus(hsc.OK)
                .assertBodySchema(mapListSchema);
        });
    });

    describe("GET /maps/:id", () => {
        it("Return a map.", async () => {
            (await client.get(`/maps/${modelIds.shift()}`)
                .send())
                .assertStatus(hsc.OK)
                .assertBodySchema(mapSchema);
        });
    });

    describe("POST /maps", () => {
        it("Create a map.", async () => {
            const createData = (await client.post(`/maps`)
                .send({
                    name: faker.lorem.words(2),
                    structure: faker.lorem.words(50),
                }))
                .assertStatus(hsc.CREATED)
                .assertBodySchema(mapSchema)
                .body;
            // Check that model was create
            (await client.get(`/maps/${createData.id}`)
                .send())
                .assertStatus(hsc.OK);
        });
    });

    describe("PUT /maps", () => {
        it("Return updated map.", async () => {
            const id = modelIds.shift();
            (await client.put(`/maps/${id}`)
                .send(modelData))
                .assertStatus(hsc.OK)
                .assertBodyEqual({...{id}, ...modelData});
        });
    });

    describe("DELETE /maps:id", () => {
        it("Remove map.", async () => {
            const id = modelIds.shift();
            (await client.get(`/maps/${id}`)
                .send())
                .assertStatus(hsc.OK);
            (await client.delete(`/maps/${id}`)
                .send())
                .assertStatus(hsc.OK);
            (await client.get(`/maps/${id}`)
                .send())
                .assertStatus(hsc.NOT_FOUND);
        });
    });

    describe("Negative. Empty params.", () => {
        [
            {
                method: hmt.post,
                path: "/maps",
            },
            {
                method: hmt.put,
                path: `/maps/{id}`,
            },
        ]
            .forEach((params) => {
                it(`Return "Not Found" on ${params.method} with empty body.`, async () => {
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

    describe("Negative. Invalid property values.", async () => {
        const invalidValues = [
            {value: null, valueType: "NULL"},
            {value: {}, valueType: "Object"},
            {value: [], valueType: "Array"},
        ];
        [
            ...[
                ...invalidValues,
                {value: (() => (fetchModels()).then((ms) => ms[0].name)), valueType: "[duplicate]"},
            ].map((params) => ({...params, name: "name"})),
            ...invalidValues.map((params) => ({...params, name: "structure"})),
        ]
            .forEach((prop) => {
                it(`Return "${hsc.BAD_REQUEST}" on POST with ${prop.valueType} value of prop "${prop.name}"`,
                    async () => {
                        (await client.post(`/maps`)
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
