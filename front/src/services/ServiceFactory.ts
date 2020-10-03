import { ApiResourceLocator } from "./ApiResourceLocator";

/** Services provider */
export default class ServiceFactory {
    /** List of services mapped by class name */
    private static services: {
        [key: string]: any,
    } = {};

    /** Get ApiResourceLocator */
    static get apiResourceLocator(): ApiResourceLocator {
        return this.services.hasOwnProperty(ApiResourceLocator.name)
            ? this.services[ApiResourceLocator.name]
            : (this.services[ApiResourceLocator.name] = new ApiResourceLocator())
    }
}
