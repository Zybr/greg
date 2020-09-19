import faker from "faker";
import { Resource } from "../models/Resource";
import reducer from "./resources";
import { addResource } from "../actions/resources/act-creators";
import { ResourceActTypes } from "../actions/resources/ResourceActTypes";
import * as types from "../actions/resources/act-types";

describe('Reducer "resources".', () => {
    const resources: Resource[] = [{
        id: faker.random.uuid(),
        name: faker.lorem.word(),
        url: faker.internet.url(),
    }]

    it("Action undefined", () => expect(reducer(undefined, {} as ResourceActTypes)).toEqual([]));

    it(`Action ${types.ADD_RESOURCE}`, () => {
        let curState: Resource[] = [];
        resources.forEach((resource: Resource) => curState = reducer(curState, addResource(resource)));
        expect(curState).toEqual(resources);
    });
});
