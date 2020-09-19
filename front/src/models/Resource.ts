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
    map: string | null;
    name: string;
    url: string;
}
