import { Resource, ResourceCreate } from "../../models/Resource";
import * as types from "./act-types";
import { ResourceRemoveAction, ResourcesAction } from "./ResourceActTypes";
import makeActionCreator from "../action-creator";
import { Actions, ErrorAction } from "../actions";
import ServiceFactory from "../../services/ServiceFactory";

const httpConst = require('http-const');
const apiUrls = ServiceFactory.apiResourceLocator;

// Create item
export const requestCreate = makeActionCreator(types.REQUEST_CREATE_RESOURCE, 'payload') as {
    (resourceData: ResourceCreate): ResourcesAction
}
export const requestCreateSuccess = makeActionCreator(types.REQUEST_CREATE_RESOURCE_SUCCESS, 'payload') as {
    (resource: Resource): ResourcesAction
}
export const requestCreateFail = makeActionCreator(types.REQUEST_CREATE_RESOURCE_FAIL, 'error') as unknown as {
    (error: Error): ErrorAction
};
export const create = (resourceData: ResourceCreate) => (dispatch: Function) => (
    Promise
        .resolve(dispatch(requestCreate(resourceData)))
        .then(() => fetch(apiUrls.resources(), {
                method: httpConst.methods.post,
                headers: {
                    [httpConst.headers.contentType]: httpConst.contentTypes.json,
                },
                body: JSON.stringify(resourceData),
            })
        ))
    .then(res => res.json())
    .then((body) => dispatch(requestCreateSuccess(body)))
    .catch(error => dispatch(requestCreateFail(error)))

// Update item
export const requestUpdate = makeActionCreator(types.REQUEST_UPDATE_RESOURCE, 'payload') as {
    (resourceData: Resource): ResourcesAction
}
export const requestUpdateSuccess = makeActionCreator(types.REQUEST_UPDATE_RESOURCE_SUCCESS, 'payload') as {
    (resource: Resource): ResourcesAction
}
export const requestUpdateFail = makeActionCreator(types.REQUEST_UPDATE_RESOURCE_FAIL, 'error') as unknown as {
    (error: Error): ErrorAction
};
export const update = (resourceData: Resource) => (dispatch: Function) => (
    Promise
        .resolve(dispatch(requestUpdate(resourceData)))
        .then(() => fetch(apiUrls.resource(resourceData.id), {
                method: httpConst.methods.put,
                headers: {
                    [httpConst.headers.contentType]: httpConst.contentTypes.json,
                },
                body: JSON.stringify(resourceData),
            })
        ))
    .then(res => res.json())
    .then((body) => dispatch(requestUpdateSuccess(body)))
    .catch(error => dispatch(requestUpdateFail(error)))

// Remove item
export const requestRemove = makeActionCreator(types.REQUEST_REMOVE_RESOURCE, 'id') as unknown as {
    (id: string): ResourceRemoveAction
}
export const requestRemoveSuccess = makeActionCreator(types.REQUEST_REMOVE_RESOURCE_SUCCESS, 'id') as unknown as {
    (id: string): ResourceRemoveAction
}
export const requestRemoveFail = makeActionCreator(types.REQUEST_REMOVE_RESOURCE_FAIL, 'error') as unknown as {
    (error: Error): ErrorAction
};
export const remove = (id: string) => (dispatch: Function) => (
    Promise
        .resolve(dispatch(requestRemove(id)))
        .then(() => fetch(apiUrls.resource(id), {
            method: httpConst.methods.del
        }))
        .then(() => dispatch(requestRemoveSuccess(id)))
        .catch(error => dispatch(requestRemoveFail(error)))
)

// Fetch list
export const requestList = makeActionCreator(types.REQUEST_RESOURCES) as {
    (): Actions
}
export const requestListSuccess = makeActionCreator(types.REQUEST_RESOURCES_SUCCESS, 'payload') as {
    (payload: Resource[]): ResourcesAction
}
export const requestListFail = makeActionCreator(types.REQUEST_RESOURCES_FAIL, 'error') as unknown as {
    (error: Error): ErrorAction
};
export const fetchList = () => (dispatch: Function) => (
    Promise
        .resolve(dispatch(requestList()))
        .then(() => fetch(apiUrls.resources()))
        .then(res => res.json())
        .then(body => dispatch(requestListSuccess(body.data)))
        .catch(error => dispatch(requestListFail(error)))
)

const ResourceActCreators = {
    update,
    // Fetch list
    requestList,
    requestListSuccess,
    requestListFail,
    fetchList,
    // Create item
    requestCreate,
    requestCreateSuccess,
    requestCreateFail,
    create,
    // Remove item
    requestRemove,
    requestRemoveSuccess,
    requestRemoveFail,
    remove
}

export default ResourceActCreators;
