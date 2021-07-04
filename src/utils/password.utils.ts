import * as restfy from 'restify'
import * as bcrypt from 'bcrypt';
import { environment } from './../common/environment';


export const hashPassword = (obj, next: restfy.Next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
        .then(hash => {
            obj.password = hash
            next();
        }).catch(next)
}