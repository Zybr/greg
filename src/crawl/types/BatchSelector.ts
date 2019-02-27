export class BatchSelector {
    public selector: string;
    public properties?: {
        [property: string]: string | BatchSelector,
    };
}
