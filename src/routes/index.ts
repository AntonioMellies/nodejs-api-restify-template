import { Router } from '../common/router'
import AuthRouter from './auth.router'
import UserRouter from './user.router'

export const routes: Router[] = [
    UserRouter,
    AuthRouter
]