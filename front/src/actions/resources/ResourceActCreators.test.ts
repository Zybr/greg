import faker from "faker";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import * as creators from "./ResourceActCreators";
import { Resource, ResourceCreate } from "../../models/Resource";
import * as types from "./act-types";
import fetchMock from "fetch-mock";
import ServiceFactory from "../../services/ServiceFactory";

const apiUrls = ServiceFactory.apiResourceLocator;
const mockStore = configureMockStore([thunk]);

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
const modelCreate: ResourceCreate = {
    name: model.name,
    url: model.url,
    parameters: {},
};
const httpError = new Error("API is down")

describe('Resources. Async "create()".', () => {
    afterEach(() => fetchMock.reset())

    it(`creates ${types.REQUEST_CREATE_RESOURCE_SUCCESS} when creation is complete`, async () => {
        const store = mockStore({})
        fetchMock.postOnce(apiUrls.resources(), model);

        await store.dispatch(creators.create(modelCreate) as any).then(() => {
            expect(store.getActions()).toEqual([
                creators.requestCreate(modelCreate),
                creators.requestCreateSuccess(model),
            ]);
        })
    })

    it(`creates ${types.REQUEST_CREATE_RESOURCE_FAIL} when creation is failed`, async () => {
        const store = mockStore({})

        fetchMock.postOnce(apiUrls.resources(), Promise.reject(httpError));
        await store.dispatch(creators.create(modelCreate) as any).then(() => {
            expect(store.getActions()).toEqual([
                creators.requestCreate(modelCreate),
                creators.requestCreateFail(httpError),
            ]);
        })
    })
});

describe('Resources. Async "update()".', () => {
    afterEach(() => fetchMock.reset())

    it(`creates ${types.REQUEST_UPDATE_RESOURCE_SUCCESS} when removing is complete`, async () => {
        const store = mockStore({})
        fetchMock.putOnce(apiUrls.resource(model.id), model);
        await store.dispatch(creators.update(model) as any).then(() => {
            expect(store.getActions()).toEqual([
                creators.requestUpdate(model),
                creators.requestUpdateSuccess(model),
            ]);
        })
    })

    it(`creates ${types.REQUEST_UPDATE_RESOURCE_FAIL} when removing is failed`, async () => {
        const store = mockStore({})

        fetchMock.putOnce(apiUrls.resource(model.id), Promise.reject(httpError));
        await store.dispatch(creators.update(model) as any).then(() => {
            expect(store.getActions()).toEqual([
                creators.requestUpdate(model),
                creators.requestUpdateFail(httpError),
            ]);
        })
    })
});

describe('Resources. Async "remove()".', () => {
    afterEach(() => fetchMock.reset())

    it(`creates ${types.REQUEST_REMOVE_RESOURCE} when removing is complete`, async () => {
        const store = mockStore({})
        fetchMock.deleteOnce(apiUrls.resource(model.id), {});
        await store.dispatch(creators.remove(model.id) as any).then(() => {
            expect(store.getActions()).toEqual([
                creators.requestRemove(model.id),
                creators.requestRemoveSuccess(model.id),
            ]);
        })
    })

    it(`creates ${types.REQUEST_REMOVE_RESOURCE_FAIL} when removing is failed`, async () => {
        const store = mockStore({})

        fetchMock.deleteOnce(apiUrls.resource(model.id), Promise.reject(httpError));
        await store.dispatch(creators.remove(model.id) as any).then(() => {
            expect(store.getActions()).toEqual([
                creators.requestRemove(model.id),
                creators.requestRemoveFail(httpError),
            ]);
        })
    })
});

describe('Resources. Async "fetchList()".', () => {
    afterEach(() => fetchMock.reset())

    it(`creates ${types.REQUEST_RESOURCES_SUCCESS} when resources fetching has been done`, async () => {
        const store = mockStore({})
        const responseBody = {
            data: [model]
        };

        fetchMock.getOnce(apiUrls.resources(), responseBody);
        await store.dispatch(creators.fetchList() as any).then(() => {
            expect(store.getActions()).toEqual([
                creators.requestList(),
                creators.requestListSuccess(responseBody.data),
            ]);
        })
    })

    it(`creates ${types.REQUEST_RESOURCES_FAIL} when resources fetching has been failed`, async () => {
        const store = mockStore({})

        fetchMock.getOnce(apiUrls.resources(), Promise.reject(httpError));
        await store.dispatch(creators.fetchList() as any).then(() => {
            expect(store.getActions()).toEqual([
                creators.requestList(),
                creators.requestListFail(httpError),
            ]);
        })
    })
});

