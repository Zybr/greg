import faker = require("faker/locale/en");
import httpStatus = require("http-status-codes");
import Client from "../resources/http/Client";
import { errorSchema, mapListSchema, mapSchema } from "../resources/schemas";

const client = new Client();

describe("routers/maps", () => {
    let modelIds: string[];

    before(async () => {
        modelIds = (await client.get("/maps")
            .send())
            .body.data
            .map((model) => model.id);
    });

    describe("GET /maps", () => {
        it("Should return list of maps.", async () => {
            const body = (await client.get("/maps")
                .send()).body;
            (await client.get("/maps")
                .send())
                .assertStatus(httpStatus.OK)
                .assertBodySchema(mapListSchema);
        });
    });

    describe("GET /maps/:id", () => {
        it("Should return a map.", async () => {
            (await client.get(`/maps/${modelIds.shift()}`)
                .send())
                .assertStatus(httpStatus.OK)
                .assertBodySchema(mapSchema);
        });
    });

    describe("POST /maps", () => {
        it("Should create a map.", async () => {
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
        it("Should return updated map.", async () => {
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
        it("Should remove map.", async () => {
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
        it('Should return "Bad Request" on creation without params.', async () => {
            (await client.post(`/maps`)
                .send())
                .assertStatus(httpStatus.BAD_REQUEST)
                .assertBodySchema(errorSchema);
        });

        it('Should return "Bab Request" on updating without params.', async () => {
            (await client.put(`/maps/${modelIds.shift()}`)
                .send())
                .assertStatus(httpStatus.BAD_REQUEST)
                .assertBodySchema(errorSchema);
        });

        it('Should return "Not Found" on fetching by invalid ID.', async () => {
            (await client.get(`/maps/${(modelIds[0]).replace(/./, "0")}`)
                .send())
                .assertStatus(httpStatus.NOT_FOUND)
                .assertBodySchema(errorSchema);
        });

        it('Should return "Not Found" on updating by invalid ID.', async () => {
            (await client.put(`/maps/${(modelIds[0]).replace(/./, "0")}`)
                .send())
                .assertStatus(httpStatus.NOT_FOUND)
                .assertBodySchema(errorSchema);
        });

        it('Should return "OK" on removing by invalid ID.', async () => {
            (await client.delete(`/maps/${(modelIds[0]).replace(/./, "0")}`)
                .send())
                .assertStatus(httpStatus.OK);
        });
    });
});
