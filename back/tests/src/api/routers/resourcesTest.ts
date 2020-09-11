import faker = require("faker/locale/en");
import httpStatus = require("http-status-codes");
import Client from "../resources/http/Client";
import { resourceListSchema, resourceSchema } from "../resources/schemas";

const client = new Client();

describe("routers/resources", () => {
    let modelIds: string[];
    let mapIds: string[];
    let invalidIdUrl = "";
    let modelData;

    before(async () => {
        modelIds = (await client.get("/resources")
            .send())
            .body.data
            .map((model) => model.id);
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
                .assertStatus(httpStatus.OK)
                .assertBodySchema(resourceListSchema);
        });
    });

    describe("GET /resources/:id", () => {
        it("Return a resource.", async () => {
            (await client.get(`/resources/${modelIds.shift()}`)
                .send())
                .assertStatus(httpStatus.OK)
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
                .assertStatus(httpStatus.CREATED)
                .assertBodySchema(resourceSchema)
                .body;
            createData.map.id.should.be.equal(modelData.map); // Check map
            createData.parameters.should.be.deep.equal(modelData.parameters); // Check parameters
            // Check that model was create
            (await client.get(`/resources/${createData.id}`)
                .send())
                .assertStatus(httpStatus.OK);
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
                .assertStatus(httpStatus.OK)
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
                .assertStatus(httpStatus.OK);
            (await client.delete(`/resources/${id}`)
                .send())
                .assertStatus(httpStatus.OK);
            (await client.get(`/resources/${id}`)
                .send())
                .assertStatus(httpStatus.NOT_FOUND);
        });
    });

    describe("Negative", () => {
        it('Return "Bad Request" on creation without params.', async () => {
            (await client.post(`/resources`)
                .send())
                .assertIsBadRequest();
        });

        it('Return "Bab Request" on updating without params.', async () => {
            (await client.put(`/resources/${modelIds.shift()}`)
                .send())
                .assertIsBadRequest();
        });

        it('Return "Not Found" on fetching by invalid ID.', async () => {
            (await client.get(invalidIdUrl)
                .send())
                .assertIsNotFound();
        });

        it('Return "Not Found" on updating by invalid ID.', async () => {
            (await client.put(invalidIdUrl)
                .send())
                .assertIsNotFound();
        });

        it('Return "OK" on removing by invalid ID.', async () => {
            (await client.delete(invalidIdUrl)
                .send())
                .assertStatus(httpStatus.OK);
        });
    });

    describe('Negative. "parameters" property.', () => {
        it('Return "Bad Request" on creation with String parameter list', async () => {
            (await client.post(`/resources`)
                .send({...modelData, ...{parameters: "string"}}))
                .assertIsBadRequest("parameters");
        });

        it('Return "Bad Request" on creation with Object parameter value.', async () => {
            (await client.post(`/resources`)
                .send({...modelData, ...{parameters: {key: {}}}}))
                .assertIsBadRequest("parameters");
        });

        it('Return "Bad Request" on creation with Array parameter value.', async () => {
            (await client.post(`/resources`)
                .send({...modelData, ...{parameters: {key: []}}}))
                .assertIsBadRequest("parameters");
        });
    });
});
