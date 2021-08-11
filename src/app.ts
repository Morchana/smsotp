import express from 'express'
//import * as compression from 'compression';
import cors from 'cors'
import { eventContext } from 'aws-serverless-express/middleware'
import { AsyncRouter } from 'express-async-router'
import { setupRoutes } from './routes'
import { dbService } from './managers'
import { RES } from './const'

export function configureApp() {
  dbService._init()
  const app = express()

  //app.use(compression());
  app.use(cors())
  app.use(express.json())
  app.use(eventContext())
  const r = AsyncRouter()
  /*
    Init controlelr
  */
  setupRoutes(r)
  app.use(
    '/',
    express.json(),
    cors(),
    r,
    (err: any, req: any, res: any, next: any) => {
      console.log('err', err)
      if (err) {
        res.status(RES.error.status).send({
          code: RES.error.res.code,
          message:
            err.toString().replace('Error:', '') || RES.error.res.message,
          data: {},
        })
      }
    }
  )
  return app
}
export const closeGlobalDatabaseConnection = () => {}
