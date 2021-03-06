import { CatalogCrawler } from "./CatalogCrawler";

/**
 * Crawler which collect data form result of google search.
 */
export class GoogleCatalogCrawler extends CatalogCrawler {
    /**
     * Set parameters for request.
     */
    public setRequestParameters(parameters: { search?: string }): CatalogCrawler {
        return super.setRequestParameters({
            q: parameters.hasOwnProperty("search") ? parameters.search : null,
        });
    }
}
