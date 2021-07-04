import * as restify from 'restify'
import { BaseService } from '../common/baseService';
import { User } from './../models/user.model';

class UserService extends BaseService<User> {

    constructor() {
        super(User);
    }

    inactiveUser = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        const id = req.params.id;
        const options = { new: true };
        User.findByIdAndUpdate(id, { active: false }, options)
            .then(super.render(resp, next))
            .catch(next);
    }

}
export default new UserService();