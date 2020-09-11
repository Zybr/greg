import { Document, Schema } from "mongoose";
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

export interface IMap extends Document {
    name: string;
    structure: string;
}

export default db.model<IMap>("Map", MapSchema, "map");
