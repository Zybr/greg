import faker from "faker";
import { Resource, ResourceCreate } from "../models/Resource";
import reducer from "./resources";
import ResourceActCreators, { requestListFail } from "../actions/resources/ResourceActCreators";
import { ResourceActTypes } from "../actions/resources/ResourceActTypes";
import * as types from "../actions/resources/act-types";

describe('Reducer "resources".', () => {
    const models: Resource[] = [
        {
            id: faker.random.uuid(),
            name: faker.lorem.word(),
            url: faker.internet.url(),
            parameters: {},
        },
        {
            id: faker.random.uuid(),
            name: faker.lorem.word(),
            url: faker.internet.url(),
            parameters: {},
        }
    ];
    const model = models[0];

    it("Action undefined", () => expect(reducer(undefined, {} as ResourceActTypes)).toEqual([]));

    it(`Fill collection on ${types.REQUEST_RESOURCES_SUCCESS}`, () => {
        let srcState: Resource[] = [];
        let newState = reducer(srcState, ResourceActCreators.requestListSuccess(models));
        expect(newState).toEqual(models);
        expect(srcState).toEqual([]);
    });

    it(`Add item on ${types.REQUEST_CREATE_RESOURCE_SUCCESS}`, () => {
        let srcState: Resource[] = [];
        let newState = reducer(srcState, ResourceActCreators.requestCreateSuccess(model));
        expect(newState).toEqual([model]);
        expect(srcState).toEqual([]);
    });

    it(`Remove item on ${types.REQUEST_REMOVE_RESOURCE_SUCCESS}`, () => {
        let srcState: Resource[] = models;
        let newState = reducer(srcState, ResourceActCreators.requestRemoveSuccess(models[0].id));
        expect(newState).not.toContain(models[0]);
        expect(srcState).toEqual(models);
    });
    [
        types.REQUEST_RESOURCES_FAIL,
        types.REQUEST_CREATE_RESOURCE_FAIL,
        types.REQUEST_REMOVE_RESOURCE_FAIL,
    ].forEach((event: string) => {
        it(`Do nothing on ${event}`, () => {
            let srcState: Resource[] = models;
            let newState = reducer(srcState, ResourceActCreators.requestListFail(new Error()));
            expect(newState).toEqual(srcState);
        });
    })
});
