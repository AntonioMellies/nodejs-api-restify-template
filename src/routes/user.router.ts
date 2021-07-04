import * as restify from 'restify'
import { Router } from '../common/router'
import UserService from '../services/user.service';


class UserRouter extends Router {

    constructor() {
        super('users')
    }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, [UserService.findAll]);
        application.get(`${this.basePath}/:id`, [UserService.validateId, UserService.findById]);
        application.post(`${this.basePath}`, [UserService.save]);
        application.patch(`${this.basePath}/:id`, [UserService.validateId, UserService.updateById]);
        application.del(`${this.basePath}/:id`, [UserService.validateId, UserService.inactiveUser]);
    }

}

export default new UserRouter();