import * as restify from 'restify'
import { ModelService } from '../common/model.service';
import { User } from './../models/user.model';

class UserService extends ModelService<User> {

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