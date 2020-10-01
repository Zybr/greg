import { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import db from "../db";
import Map, { IMap } from "./Map";

const validateParameterList = (list: any) => (!(list instanceof Object))
    ? false
    : Object.values(list).every((value) => "string" === typeof value);

export const ResourceSchema = new Schema({
    map: {
        ref: "Map",
        required: false,
        type: Schema.Types.ObjectId,
    },
    name: {
        required: true,
        type: String,
        unique: true,
    },
    parameters: {
        required: true,
        type: Object,
        validate: validateParameterList,
    },
    url: {
        required: true,
        type: String,
    },
});

ResourceSchema.plugin(uniqueValidator);

function autoPopulate() {
    this.populate("map");
}

ResourceSchema.pre("find", autoPopulate);
ResourceSchema.pre("findOne", autoPopulate);

export interface IResource extends Document {
    map: IMap;
    name: string;
    url: string;
}

export default db.model<IResource>("Resource", ResourceSchema, "resource");
