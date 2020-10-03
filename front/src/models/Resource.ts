import Map from "./Map";

export interface Resource {
    id: string,
    name: string;
    url: string;
    parameters: {
        [key: string]: string,
    }
    map?: Map;
}

export interface ResourceCreate {
    name: string;
    url: string;
    parameters: {
        [key: string]: string,
    }
    map?: string;
}
