import * as restify from 'restify';

export abstract class Router {

    basePath: string

    constructor(basePath: string) {
        this.basePath = `/${basePath}`
    }

    abstract applyRoutes(application: restify.Server);
}