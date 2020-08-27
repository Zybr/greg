import mongoose = require("mongoose");

export type ISerialize = (req: Request, model: {}) => {} | Promise<{}>;

/**
 * Serialize model.
 *
 * @param req Request
 * @param model Model
 */
export function serializeModel(req: Request, model: mongoose.Document): {} {
    return model.toObject({
        getters: true,
        transform: (doc, ret) => {
            delete ret._id;
        },
        versionKey: false,
        virtuals: true,
    });
}
