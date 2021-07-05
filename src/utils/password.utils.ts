import * as restfy from 'restify'
import * as bcrypt from 'bcrypt';
import { environment } from '../server/environment';


export const hashPassword = (obj, next: restfy.Next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
        .then(hash => {
            obj.password = hash
            next();
        }).catch(next)
}

export const matchPassword = (password: string, userPassword: string): boolean => {
    return bcrypt.compareSync(password, userPassword)
}