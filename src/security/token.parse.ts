import { User } from '../models/user.model';
import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { environment } from '../server/environment'

export const tokenParser: restify.RequestHandler = (req, resp, next) => {
    const token = extractToken(req)
    if (token) {
        jwt.verify(token, environment.security.apiSecret, applyBearer(req, next))
    } else {
        next()
    }
}

function extractToken(req: restify.Request) {
    //Authorization: Bearer TOKEN
    let token = undefined
    const authorization = req.header('authorization')
    if (authorization) {
        const parts: string[] = authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1]
        }
    }
    return token
}

function applyBearer(req: restify.Request, next): (error, decoded) => void {
    return (error, decoded) => {
        if (decoded) {
            User.findOne({ email: decoded.sub })
                .then(user => {
                    if (user) {
                        req.authenticated = user //Associar o login no request  
                    }
                    next()
                }).catch(next)
        } else {
            next()
        }
    }
}