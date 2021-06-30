import { User } from './../models/user.model';

class UserService {

    findAll(req, resp, next) {
        User.find().then(users => {
            resp.json(users)
            return next();
        })
    }

    findById(req, resp, next) {
        const id = req.params.id
        User.findById(id).then(user => {
            if (user) {
                resp.json(user)
                return next();
            }
            resp.send(404)
            return next();
        })
    }

}
export default new UserService();