import { User } from './models/user.model';

declare module 'restify' {
    export interface Request {
        authenticated: any
    }
}