import { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import db from "../db";

export const MapSchema = new Schema({
    name: {
        required: true,
        type: String,
        unique: true,
    },
    structure: {
        required: true,
        type: String,
    },
});

MapSchema.plugin(uniqueValidator);

export interface IMap extends Document {
    name: string;
    structure: string;
}

export default db.model<IMap>("Map", MapSchema, "map");
