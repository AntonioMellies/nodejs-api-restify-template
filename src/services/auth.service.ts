import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';
import { NotAuthorizedError } from 'restify-errors';
import { environment } from './../common/environment';


class AuthService {

    authenticate(req, resp, next): restify.RequestHandler {
        const { login, password } = req.body;

        if (login === 'test' && password === 'test') {
            const token = jwt.sign({ sub: 'login', iss: 'api' }, environment.security.apiSecret)
            resp.json({ acessToken: token })
            return next(false);
        } else {
            return next(new NotAuthorizedError('Invalid Credentials'));
        }
    }

}
export default new AuthService();