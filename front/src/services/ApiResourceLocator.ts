import { BASE_URL } from '../configs/db';

/**
 * Pro
 */
export class ApiResourceLocator {
    /** Base API URL (hots + domain)*/
    get BASE_URL(): string {
        return BASE_URL;
    }

    public resources(): string {
        return this.makeUrl('resources');
    }

    public resource(id: string): string {
        return this.makeUrl('resources/{id}', {id});
    }

    /** Fill template with parameters */
    private makeUrl(template: string, data: { [key: string]: string } = {}): string {
        return Object.keys(data)
            .reduce(
                (template, key) => template.replace(new RegExp(`{${key}}`, 'g'), data[key]),
                `${this.BASE_URL}${template}`
            )
    }
}
