import { Document, Schema } from "mongoose";
import mongoose = require("mongoose");
import Map, { IMap } from "./Map";

export const ResourceSchema = new Schema({
    map: {
        ref: "Map",
        required: true,
        type: Schema.Types.ObjectId,
    },
    name: {
        required: true,
        type: String,
        unique: true,
    },
    url: {
        required: true,
        type: String,
    },
});

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

export default mongoose.model<IResource>("Resource", ResourceSchema, "resource");
