import { IMap } from "../../../back/src/database/models/Map";

export default interface IResource {
    id: number;
    name: string;
    url: string;
    map: IMap | null;
}
