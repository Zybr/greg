import { Resource } from "../../models/Resource";
import * as types from "./act-types";
import { ResourceAction, ResourceErrorAction, ResourceRemoveAction, ResourcesAction } from "./ResourceActTypes";
import { Action } from "../Action";

export const addResource = (resource: Resource): ResourceAction => ({
    type: types.ADD_RESOURCE,
    payload: resource,
});

export const removeResource = (id: string): ResourceRemoveAction => ({
    type: types.REMOVE_RESOURCE,
    id,
});

export const updateResource = (resource: Resource): ResourceAction => ({
    type: types.UPDATE_RESOURCE,
    payload: resource,
});

export const fetchResourcesRequest = (): Action => ({
    type: types.FETCH_RESOURCES_REQUEST,
});

export const fetchResourcesSuccess = (body: { data: Resource[] }): ResourcesAction => ({
    type: types.FETCH_RESOURCES_SUCCESS,
    payload: body.data
});

export const fetchResourcesFailure = (error: Error): ResourceErrorAction => ({
    type: types.FETCH_RESOURCES_FAILURE,
    error,
});

export const fetchResources = () => (dispatch: Function) => (
    Promise
        .resolve(dispatch(fetchResourcesRequest()))
        .then(() => fetch('http://localhost:3000/resources'))
        .then(res => res.json())
        .then(body => dispatch(fetchResourcesSuccess(body)))
        .catch(error => dispatch(fetchResourcesFailure(error)))
)

const ResourceActCreators = {
    addResource,
    removeResource,
    updateResource,
    fetchResourcesRequest,
    fetchResourcesSuccess,
    fetchResourcesFailure,
    fetchResources,
}

export default ResourceActCreators;
