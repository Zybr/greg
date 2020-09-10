import { backUrl } from "../../configs/config";

/** API routes provider */
export default class ResourceLocatorService {

    /** List of base routes */
    private readonly BASE_ROUTES = {
        maps: "/maps",
        resources: "/resources",
    };

    /** Get "resource" routes */
    public get resourceRoutes() {
        const modelUrl = `${backUrl}${this.BASE_ROUTES.resources}/{id}`;
        const listUrl = `${backUrl}${this.BASE_ROUTES.resources}`;

        return {
            create: (): string => listUrl,
            delete: (id): string => modelUrl.replace("{id}", id),
            list: (): string => listUrl,
            read: (id): string => modelUrl.replace("{id}", id),
            update: (id): string => modelUrl.replace("{id}", id),
        };
    }
}
