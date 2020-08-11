import { Document, Schema } from "mongoose";
import mongoose = require("mongoose");
import { IMap, MapSchema } from "./Map";

export const ResourceSchema = new Schema({
    map: {
        ref: MapSchema,
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

export interface IResource extends Document {
    map: IMap["_id"];
    name: string;
    url: string;
}

export default mongoose.model("resource", ResourceSchema, "resource");
