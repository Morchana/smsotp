import { RES } from '../../const'
import { RequestHandler } from 'express'

import '../../middleware'
const API_KEY = process.env.OTP_API_KEY
export const checkInstaffAuthMiddleware: RequestHandler<any> = async (
  req,
  res,
  next
) => {
  let isPassAuth = req.headers.authorization.indexOf(API_KEY)>=0
  

  if (!isPassAuth) {
    return res.status(RES.unauthorize.status).send({
      code: RES.unauthorize.res.code,
      message: RES.unauthorize.res.message,
    } as any)
  }
  next()
}
