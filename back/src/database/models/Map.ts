import { Document, Schema } from "mongoose";
import DB from "../DB";

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

export default DB.model<IMap>("map", MapSchema);
