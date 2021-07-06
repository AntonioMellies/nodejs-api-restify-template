import * as restify from 'restify'
import { Router } from '../common/router'
import { authorize } from '../security/authz.handler';
import UserService from '../services/user.service';


class UserRouter extends Router {

    constructor() {
        super('users')
    }

    applyRoutes(application: restify.Server) {
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, [authorize('admin'), UserService.findAll]);
        application.get({ path: `${this.basePath}/:id`, version: '1.0.0' }, [authorize('admin'), UserService.validateId, UserService.findById]);
        application.post({ path: `${this.basePath}`, version: '1.0.0' }, [authorize('admin', 'user'), UserService.save]);
        application.patch({ path: `${this.basePath}/:id`, version: '1.0.0' }, [authorize('user'), UserService.validateId, UserService.updateById]);
        application.del({ path: `${this.basePath}/:id`, version: '1.0.0' }, [authorize('user'), UserService.validateId, UserService.inactiveUser]);
    }

}

export default new UserRouter();