import IResource from "../../models/IResource";
import ResourceLocatorService from "./ResourceLocatorService";

/** API Resource manager */
export default class ResourceService {
    private resourceLocatorSrv: ResourceLocatorService;

    constructor(resourceLocatorSrv: ResourceLocatorService) {
        this.resourceLocatorSrv = resourceLocatorSrv;
    }

    public getList(): Promise<IResource> {
        return fetch(this.resourceLocatorSrv.resourceRoutes.list())
            .then((response) => response.json())
            .catch((err) => {
                throw err;
            });
    }
}
