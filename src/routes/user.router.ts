import * as restify from 'restify'
import { Router } from '../common/router'
import UserService from '../services/user.service';


class UserRouter extends Router {

    constructor() {
        super('user')
    }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, [UserService.findAll]);
        application.get(`${this.basePath}/:id`, [UserService.findById]);    
    }
}

export default new UserRouter();