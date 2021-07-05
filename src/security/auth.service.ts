import { User } from './../models/user.model';
import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';
import { NotAuthorizedError } from 'restify-errors';
import { environment } from '../server/environment';


class AuthService {

    authenticate(req, resp, next) {
        const { login, password } = req.body;
        User.findOne({ email: login }, '+password')
            .then(user => {
                if (user && user.matchPassword(password)) {
                    const token = jwt.sign({ sub: user.email, iss: 'meat-api' }, environment.security.apiSecret)
                    resp.json({ email: user.email, name: user.name, acessToken: token })
                    return next(false);
                } else {
                    return next(new NotAuthorizedError('Invalid Credentials'));
                }
            }).catch(next)
    }

}
export default new AuthService();