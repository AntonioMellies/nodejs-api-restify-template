import * as mongoose from 'mongoose';
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'

export class ModelService<D extends mongoose.Document> {

    constructor(protected model: mongoose.Model<D>) {
    }

    findAll = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        this.model.find()
            .then(this.renderAll(resp, next))
            .catch(next);
    }

    findById = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        const id = req.params.id
        this.model.findById(id)
            .then(this.render(resp, next))
            .catch(next);
    }

    save = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        let document = new this.model(req.body);
        document.save()
            .then(this.render(resp, next))
            .catch(next);
    }

    updateById = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        const id = req.params.id;
        const options = { runValidators: true, new: true };
        this.model.findByIdAndUpdate(id, req.body, options)
            .then(this.render(resp, next))
            .catch(next);
    }

    validateId = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new NotFoundError('Document not found'))
        }
        return next()
    }

    envelope = (document: any): any => {
        let resource = Object.assign({ _links: {} }, document.toJSON())
        resource._links.self = `/${this.model.collection.name}/${document._id}`
        return resource
    }

    render = (response: restify.Response, next: restify.Next) => {
        return (document) => {
            if (document) {
                response.json(this.envelope(document))
            } else {
                throw new NotFoundError('Documento não encontrado')
            }
            return next()
        }
    }

    renderAll = (response: restify.Response, next: restify.Next) => {
        return (documents: any[]) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    array[index] = this.envelope(document);
                });
                response.json(documents)
            } else {
                response.json([])
            }
            return next()
        }
    }
}