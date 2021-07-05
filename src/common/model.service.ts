import * as mongoose from 'mongoose';
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'

export class ModelService<D extends mongoose.Document> {

    pageSize = 10;

    constructor(protected model: mongoose.Model<D>) {
    }

    findAll = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        let _page = parseInt(req.query._page || 1)
        let _pageSize = parseInt(req.query._pageSize || this.pageSize)

        _page = _page > 0 ? _page : 1
        _pageSize = _pageSize > 0 ? _pageSize : this.pageSize

        const skip = (_page - 1) * _pageSize

        this.model.count({}).exec()
            .then(count => {
                this.model.find()
                    .skip(skip)
                    .limit(_pageSize)
                    .then(this.renderAll(resp, next, { page: _page, count, pageSize: _pageSize, url: req.url }))
            }).catch(next);
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
            .then(this.render(resp, next, { status: 201 }))
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

    envelopeAll = (documents: any[], options: any = {}): any => {
        let resource: any = {
            _links: {
                self: `${options.url}`,
            },
            items: documents
        }
        if (options.page && options.count && options.pageSize) {
            const remaining = options.count - (options.page * options.pageSize)
            if (remaining > 0) {
                resource._links.next = `/${this.model.collection.name}?_page=${options.page + 1}&_pageSize=${options.pageSize}`
            }

            if (options.page > 1) {
                resource._links.previous = `/${this.model.collection.name}?_page=${options.page - 1}&_pageSize=${options.pageSize}`
            }
        }
        return resource
    }


    render = (response: restify.Response, next: restify.Next, options: any = {}) => {
        return (document) => {
            if (document) {
                if (options.status) {
                    response.status(options.status)
                }
                if (document.password) {
                    document.password = undefined
                }
                response.json(this.envelope(document))
            } else {
                throw new NotFoundError('Documento não encontrado')
            }
            return next()
        }
    }

    renderAll = (response: restify.Response, next: restify.Next, options: any = {}) => {
        return (documents: any[]) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    array[index] = this.envelope(document);
                });
                response.json(this.envelopeAll(documents, options))
            } else {
                response.json(this.envelopeAll([], options))
            }
            return next()
        }
    }
}