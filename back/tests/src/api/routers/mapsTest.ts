import faker = require("faker/locale/en");
import httpStatus = require("http-status-codes");
import Client from "../resources/http/Client";
import { mapListSchema, mapSchema } from "../resources/schemas";

const client = new Client();

describe("routers/maps", () => {
    let modelIds: string[];
    let invalidIdUrl = "";

    before(async () => {
        modelIds = (await client.get("/maps")
            .send())
            .body.data
            .map((model) => model.id);
        invalidIdUrl = `/resources/${(modelIds[0]).replace(/./, "0")}`;
    });

    describe("GET /maps", () => {
        it("Return list of maps.", async () => {
            const body = (await client.get("/maps")
                .send()).body;
            (await client.get("/maps")
                .send())
                .assertStatus(httpStatus.OK)
                .assertBodySchema(mapListSchema);
        });
    });

    describe("GET /maps/:id", () => {
        it("Return a map.", async () => {
            (await client.get(`/maps/${modelIds.shift()}`)
                .send())
                .assertStatus(httpStatus.OK)
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
                .assertStatus(httpStatus.CREATED)
                .assertBodySchema(mapSchema)
                .body;
            // Check that model was create
            (await client.get(`/maps/${createData.id}`)
                .send())
                .assertStatus(httpStatus.OK);
        });
    });

    describe("PUT /maps", () => {
        it("Return updated map.", async () => {
            const id = modelIds.shift();
            const modelData = {
                name: faker.lorem.words(3),
                structure: faker.lorem.words(50),
            };
            (await client.put(`/maps/${id}`)
                .send(modelData))
                .assertStatus(httpStatus.OK)
                .assertBodyEqual({...{id}, ...modelData});
        });
    });

    describe("DELETE /maps:id", () => {
        it("Remove map.", async () => {
            const id = modelIds.shift();
            (await client.get(`/maps/${id}`)
                .send())
                .assertStatus(httpStatus.OK);
            (await client.delete(`/maps/${id}`)
                .send())
                .assertStatus(httpStatus.OK);
            (await client.get(`/maps/${id}`)
                .send())
                .assertStatus(httpStatus.NOT_FOUND);
        });
    });

    describe("Negative", () => {
        it('Return "Bad Request" on creation without params.', async () => {
            (await client.post(`/maps`)
                .send())
                .assertIsBadRequest();
        });

        it('Return "Bab Request" on updating without params.', async () => {
            (await client.put(`/maps/${modelIds.shift()}`)
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
});
