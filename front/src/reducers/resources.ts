import { Resource } from "../models/Resource";
import * as types from "../actions/resources/act-types";
import { ResourceActTypes, ResourceRemoveAction } from "../actions/resources/ResourceActTypes";
import { ErrorAction } from "../actions/actions";

export default function resources(state: Resource[] = [], action: ResourceActTypes): Resource[] {
    switch (action.type) {
        case types.REQUEST_RESOURCES_SUCCESS:
            return [...action.payload];
        case types.REQUEST_CREATE_RESOURCE_SUCCESS:
            return [...state, action.payload];
        case types.REQUEST_REMOVE_RESOURCE_SUCCESS:
            return [...state].filter((resource) => resource.id !== (action as ResourceRemoveAction).id);
        case types.UPDATE_RESOURCE:
            return [...state].map((resource) => resource.id === action.payload.id ? action.payload : resource);
        case types.REQUEST_RESOURCES_FAIL:
        case types.REQUEST_CREATE_RESOURCE_FAIL:
        case types.REQUEST_REMOVE_RESOURCE_FAIL:
        default:
            return state;
    }
}
