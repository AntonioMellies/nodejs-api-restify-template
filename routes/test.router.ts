import * as restifi from 'restify'
import { Router } from '../common/router'
import TestService from '../services/test.service';


class TestRouter extends Router {
    applyRoutes(application: restifi.Server) {
        application.get('/test', TestService.findAll);

        application.get('/test/:id', (req, resp, next) => {
            next()
        });
    }
}

export const TestRouters = new TestRouter() 