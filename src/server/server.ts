import { handleError } from './../handlers/error.handler';
import { tokenParser } from './../utils/token.parse';
import * as restifi from 'restify'
import { environment } from '../common/environment';
import { routes } from './../routes/index';

export class Server {

    application: restifi.Server;

    initServer(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restifi.createServer({
                    name: 'api-template',
                    version: '1.0.0'
                })

                this.application.use(restifi.plugins.queryParser())
                this.application.use(restifi.plugins.bodyParser())
                this.application.use(tokenParser)

                //Routers
                for (let router of routes) {
                    router.applyRoutes(this.application);
                }

                this.application.get('/info', (req, resp, next) => {
                    resp.send({
                        browser: req.userAgent(),
                        method: req.method,
                        url: req.href(),
                        path: req.path(),
                        query: req.query
                    });
                    return next();
                })

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                })

                this.application.on('restifyError', handleError)

            } catch (error) {
                reject(error);
            }
        })
    }

    bootstrap(): Promise<Server> {
        return this.initServer().then(() => this)
    }

}