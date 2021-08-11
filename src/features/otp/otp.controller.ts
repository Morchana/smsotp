import { RES, OTP } from '../../const'
import { Request, Response } from 'express'
import { AsyncRouterInstance } from 'express-async-router'
import { otpManager } from '../../managers'

export const OTPControllers = (router: AsyncRouterInstance) => {
  router.post(
    OTP.otp_request,
    async (
      req: Request<{}, {}, OTP['otp_request']['Req']>,
      res: Response<OTP['otp_request']['Res']>
    ) => {
      console.log(req)
      const result = await otpManager.requestOTP(req.body.tel)
      res.status(RES['success'].status).send({
        ...RES['success'].res,
        data: result,
      })
    }
  )
  router.post(
    OTP.otp_verify,
    async (
      req: Request<{}, {}, OTP['otp_verify']['Req']>,
      res: Response<OTP['otp_verify']['Res']>
    ) => {
      const result = await otpManager.verifyOTP(
        req.body.tel,
        req.body.refCode,
        req.body.otpToken
      )
      res.status(RES['success'].status).send({
        ...RES['success'].res,
        data: { success: result.success },
      })
    }
  )
}
