import { Actions, ErrorAction } from "../actions";
import { Resource } from "../../models/Resource";

export interface ResourceAction extends Actions {
    type: string,
    payload: Resource,
}

export interface ResourcesAction extends Actions {
    type: string,
    payload: Resource[],
}

export interface ResourceRemoveAction extends Actions {
    type: string,
    id: string,
}

export type ResourceActTypes = ResourceAction | ResourcesAction | ResourceRemoveAction | ErrorAction;
