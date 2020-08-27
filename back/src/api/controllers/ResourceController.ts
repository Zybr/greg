import Resource from "../../database/models/Resource";
import CrudController from "./CrudController";

export default class ResourceController extends CrudController {
    public constructor() {
        super();
        this.setModel(Resource);
    }

    public list() {
        this.sendModels.apply(this, arguments);
    }

    public get() {
        this.fetchModel.apply(this, arguments);
    }

    public create(): void {
        this.createModel.apply(this, arguments);
    }

    public update(): void {
        this.updateModel.apply(this, arguments);
    }

    public remove(): void {
        this.removeModel.apply(this, arguments);
    }
}
