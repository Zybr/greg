import { Resource } from "../models/Resource";
import * as types from "../actions/resources/act-types";
import { ResourceActTypes, ResourceErrorAction } from "../actions/resources/ResourceActTypes";

export default function resources(state: Resource[] = [], action: ResourceActTypes): Resource[] {
    switch (action.type) {
        case types.ADD_RESOURCE:
            return [...state, action.payload];
        case types.UPDATE_RESOURCE:
            return [...state].map((resource) => resource.id === action.payload.id ? action.payload : resource);
        case types.REMOVE_RESOURCE:
            return [...state].filter((resource) => resource.id !== action.payload.id);
        case types.FETCH_RESOURCES_SUCCESS:
            return [...action.payload];
        case types.FETCH_RESOURCES_FAILURE:
            console.error((action as ResourceErrorAction).error)
            return state;
        default:
            return state;
    }
}
