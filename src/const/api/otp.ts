import { BasicAPIResponse } from '../util'
const BASE = 'otp'
export const OTP = {
  otp_request: `/${BASE}/otp_request`,
  otp_verify: `/${BASE}/otp_verify`,
  ERROR_MSG: {
    otpFail: 'ยืนยัน OTP ล้มเหลว',
  },
}
export type OTP = {
  otp_request: {
    Req: {
      tel: string
    }
    Res: BasicAPIResponse<{
      success: boolean
      token?: string
      refCode:string
    }>
  }
  otp_verify: {
    Req: {
      otpToken: string
      refCode: string
      tel: string
    }
    Res: BasicAPIResponse<{
      success: boolean
    }>
  }
}
