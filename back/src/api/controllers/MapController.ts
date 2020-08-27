import Map from "../../database/models/Map";
import CrudController from "./CrudController";

export default class MapController extends CrudController {
    public constructor() {
        super();
        this.setModel(Map);
    }

    public list(): void {
        this.sendModels.apply(this, arguments);
    }

    public get(): void {
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
