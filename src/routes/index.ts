import { Router } from '../common/router'
import AuthRouter from './auth.router'
import TestRouter from './test.router'

export const routes: Router[] = [
    TestRouter,
    AuthRouter
]