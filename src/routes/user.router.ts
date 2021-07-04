import * as restify from 'restify'
import { Router } from '../common/router'
import UserService from '../services/user.service';


class UserRouter extends Router {

    constructor() {
        super('users')
    }

    applyRoutes(application: restify.Server) {
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, [UserService.findAll]);
        application.get({ path: `${this.basePath}/:id`, version: '1.0.0' }, [UserService.validateId, UserService.findById]);
        application.post({ path: `${this.basePath}`, version: '1.0.0' }, [UserService.save]);
        application.patch({ path: `${this.basePath}/:id`, version: '1.0.0' }, [UserService.validateId, UserService.updateById]);
        application.del({ path: `${this.basePath}/:id`, version: '1.0.0' }, [UserService.validateId, UserService.inactiveUser]);
    }

}

export default new UserRouter();