import faker from "faker";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import * as actions from "./act-creators";
import { Resource } from "../../models/Resource";
import * as types from "./act-types";
import fetchMock from "fetch-mock";
import { FETCH_RESOURCES_FAILURE, FETCH_RESOURCES_SUCCESS } from "./act-types";

const mockStore = configureMockStore([thunk]);
const listUrl = "http://localhost:3000/resources";
const model: Resource = {
    id: faker.random.uuid(),
    name: faker.lorem.words(),
    parameters: {
        [faker.lorem.word()]: faker.lorem.word(),
    },
    url: faker.internet.url(),
    map: {
        id: faker.random.uuid(),
        name: faker.lorem.word(),
        structure: faker.lorem.words(10),
    },
};

describe("Resources. Actions.", () => {
    it("addResource", () => {
        expect(actions.addResource(model)).toEqual({
            type: types.ADD_RESOURCE,
            payload: model,
        })
    });

    it("updateResource", () => {
        expect(actions.updateResource(model)).toEqual({
            type: types.UPDATE_RESOURCE,
            payload: model,
        })
    });

    it("removeResource", () => {
        expect(actions.removeResource(model.id)).toEqual({
            type: types.REMOVE_RESOURCE,
            id: model.id,
        })
    });
});

describe("Resources. Async actions.", () => {
    afterEach(() => {
        fetchMock.reset();
    })

    it(`creates ${FETCH_RESOURCES_SUCCESS} when resources fetching has been done`, () => {
        const store = mockStore({})
        const responseBody = {
            data: [model]
        };

        fetchMock.getOnce(listUrl, responseBody);
        store.dispatch(actions.fetchResources() as any).then(() => {
            expect(store.getActions()).toEqual([
                actions.fetchResourcesRequest(),
                actions.fetchResourcesSuccess(responseBody),
            ]);
        })
    })

    it(`creates ${FETCH_RESOURCES_FAILURE} when resources fetching has been failed`, () => {
        const store = mockStore({})
        const error = new Error("API is down")

        fetchMock.getOnce(listUrl, Promise.reject(error));
        store.dispatch(actions.fetchResources() as any).then(() => {
            expect(store.getActions()).toEqual([
                actions.fetchResourcesRequest(),
                actions.fetchResourcesFailure(error),
            ]);
        })
    })
});
