import * as restify from 'restify'
import { Router } from '../common/router'
import AuthService from './auth.service';


class AuthRouter extends Router {

    constructor() {
        super('auth')
    }

    applyRoutes(application: restify.Server) {
        application.post(`${this.basePath}/authenticate`, AuthService.authenticate);
    }
}

export default new AuthRouter();