import faker = require("faker/locale/en");
import httpStatus = require("http-status-codes");
import Client from "../resources/http/Client";
import { errorSchema, resourceListSchema, resourceSchema } from "../resources/schemas";

const client = new Client();

describe("routers/resources", () => {
    let modelIds: string[];
    let mapIds: string[];

    before(async () => {
        modelIds = (await client.get("/resources")
            .send())
            .body.data
            .map((model) => model.id);
        mapIds = (await client.get("/maps")
            .send())
            .body.data
            .map((model) => model.id);
    });

    describe("GET /resources", () => {
        it("Should return list of resource.", async () => {
            (await client.get("/resources")
                .send())
                .assertStatus(httpStatus.OK)
                .assertBodySchema(resourceListSchema);
        });
    });

    describe("GET /resources/:id", () => {
        it("Should return a resource.", async () => {
            (await client.get(`/resources/${modelIds.shift()}`)
                .send())
                .assertStatus(httpStatus.OK)
                .assertBodySchema(resourceSchema);
        });
    });

    describe("POST /resources", () => {
        it("Should create a resource.", async () => {
            const modelData = {
                map: mapIds.shift(),
                name: faker.lorem.words(2),
                url: faker.internet.url(),
            };
            const createData = (await client.post(`/resources`)
                .send(modelData))
                .assertStatus(httpStatus.CREATED)
                .assertBodySchema(resourceSchema)
                .body;
            // Check map
            createData.map.id.should.be.equal(modelData.map);
            // Check that model was create
            (await client.get(`/resources/${createData.id}`)
                .send())
                .assertStatus(httpStatus.OK);
        });
    });

    describe("PUT /resources", () => {
        it("Should return updated resource.", async () => {
            const id = modelIds.shift();
            const modelData = {
                map: mapIds.shift(),
                name: faker.lorem.words(3),
                url: faker.internet.url(),
            };
            (await client.put(`/resources/${id}`)
                .send(modelData))
                .assertStatus(httpStatus.OK)
                .assertBodySchema(resourceSchema)
                .body.map.id.should.be.equal(modelData.map);
        });
    });

    describe("DELETE /resources:id", () => {
        it("Should remove resource.", async () => {
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
        it('Should return "Bad Request" on creation without params.', async () => {
            (await client.post(`/resources`)
                .send())
                .assertStatus(httpStatus.BAD_REQUEST)
                .assertBodySchema(errorSchema);
        });

        it('Should return "Bab Request" on updating without params.', async () => {
            (await client.put(`/resources/${modelIds.shift()}`)
                .send())
                .assertStatus(httpStatus.BAD_REQUEST)
                .assertBodySchema(errorSchema);
        });

        it('Should return "Not Found" on fetching by invalid ID.', async () => {
            (await client.get(`/resources/${(modelIds[0]).replace(/./, "0")}`)
                .send())
                .assertStatus(httpStatus.NOT_FOUND)
                .assertBodySchema(errorSchema);
        });

        it('Should return "Not Found" on updating by invalid ID.', async () => {
            (await client.put(`/resources/${(modelIds[0]).replace(/./, "0")}`)
                .send())
                .assertStatus(httpStatus.NOT_FOUND)
                .assertBodySchema(errorSchema);
        });

        it('Should return "OK" on removing by invalid ID.', async () => {
            (await client.delete(`/resources/${(modelIds[0]).replace(/./, "0")}`)
                .send())
                .assertStatus(httpStatus.OK);
        });
    });
});
