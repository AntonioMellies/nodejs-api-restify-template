import { mergePatchBodyParser } from './merge-patch.parser';
import { environment } from './environment';
import { handleError } from './../handlers/error.handler';
import { tokenParser } from './../utils/token.parse';
import * as restifi from 'restify'
import { routes } from './../routes/index';
import * as mongoose from 'mongoose';

export class Server {

    application: restifi.Server;

    initServer(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restifi.createServer({
                    name: 'api-template',
                    version: '1.0.0'
                })

                // DataBase
                mongoose.connect(environment.db.url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false
                }).catch(
                    (err) => {
                        console.error(err)
                    }
                )

                this.application.use(restifi.plugins.queryParser())
                this.application.use(restifi.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
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

    shutdown() {
        return mongoose.disconnect()
            .then(() => {
                this.application.close()
            })
    }
}