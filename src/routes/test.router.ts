import * as restify from 'restify'
import { Router } from '../common/router'
import { authorize } from '../handlers/auth.handler';
import TestService from '../services/test.service';


class TestRouter extends Router {

    constructor() {
        super('test')
    }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, [authorize(), TestService.findAll]);
        application.get(`${this.basePath}/:id`, [authorize(), TestService.findAll]);
    }
}

export default new TestRouter();