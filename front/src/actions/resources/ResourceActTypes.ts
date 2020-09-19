import { Action } from "../Action";
import { Resource } from "../../models/Resource";

export interface ResourceAction extends Action {
    type: string,
    payload: Resource,
}

export interface ResourcesAction extends Action {
    type: string,
    payload: Resource[],
}

export interface ResourceRemoveAction extends Action {
    type: string,
    id: string,
}

export interface ResourceErrorAction extends Action {
    type: string,
    error: Error,
}

export type ResourceActTypes = ResourceAction | ResourcesAction | ResourceRemoveAction | ResourceErrorAction;
