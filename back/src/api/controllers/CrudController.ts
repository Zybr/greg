import serializer from "express-serializer";
import httpStatus = require("http-status-codes");
import { Document } from "mongoose";
import db from "../../database/DB";
import NotFoundError from "../errors/NotFoundError";
import { Responder } from "../Responder";
import { ISerialize, serializeModel } from "../serialization/serialization";

/**  Base controller for working with a model. */
export default class CrudController {
    private responder: Responder;

    /** Model serializer */
    private serializer: ISerialize;

    /** Model */
    private model;

    public constructor() {
        this.responder = new Responder();
        this.setSerializer(serializeModel);
    }

    /** Set serializer. */
    public setSerializer(serializeFunction: ISerialize): this {
        this.serializer = serializeFunction;

        return this;
    }

    /** Set main model. */
    public setModel(model: any): this {
        this.model = model;

        return this;
    }

    /** Send list of models. */
    protected sendModels(req, res, next): void {
        this.model.find() // Fetch
            .then((models) => {
                serializer(req, models, this.serializer) // Pass
                    .then((data) => res.send({data}))
                    .catch(next);
            })
            .catch(next);
    }

    /** Send a specific model. */
    protected fetchModel(req, res, next): void {
        if (!db.Types.ObjectId.isValid(req.params.id)) {
            throw new NotFoundError();
        }

        this.model.findById(req.params.id) // Fetch
            .then((model) => {
                if (!(model instanceof Document)) {
                    throw new NotFoundError();
                }

                serializer(req, model, this.serializer) // Pass
                    .then((json) => res.send(json))
                    .catch(next);
            })
            .catch(next);
    }

    /** Create a model. */
    protected createModel(req, res, next): void {
        const model = (new this.model(req.body)); // Create by parameters

        model.validate() // Validate
            .catch((err) => {
                throw err;
            })
            .then(() => model.save()) // Save
            .then((savedModel) => this.model.findById(savedModel.id)) // Refresh to load relations
            .then((refreshedModel) => { // Return model
                serializer(req, refreshedModel, this.serializer)
                    .then((json) => res.status(httpStatus.CREATED).send(json))
                    .catch(next);
            })
            .catch(next);
    }

    /**  Update a model. */
    protected updateModel(req, res, next): void {
        this.model.findById(req.params.id) // Fetch
            .then((model) => { // Check that exists
                if (!(model instanceof Document)) {
                    throw new NotFoundError();
                }
                return model;
            })
            .then((model) => ( // Validate
                model.overwrite(req.body)
                    .validate()
                    .catch((err) => {
                        throw err;
                    })
                    .then(() => model)
            ))
            .then((model) => model.save()) // Save
            .then((savedModel) => this.model.findById(savedModel.id)) // Refresh to load relations
            .then((refreshedModel) => {
                serializer(req, refreshedModel, this.serializer) // Return model
                    .then((json) => res.send(json))
                    .catch(next);
            })
            .catch(next);
    }

    /** Remove a model. */
    protected removeModel(req, res, next): void {
        if (!db.Types.ObjectId.isValid(req.params.id)) {
            return this.responder.sendOk(res);
        }

        this.model.deleteOne({_id: req.params.id})
            .catch((err) => {
                throw err;
            })
            .then(() => this.responder.sendOk(res))
            .catch(next);
    }
}
