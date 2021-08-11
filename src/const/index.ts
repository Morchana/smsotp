import { BasicAPIResponse } from './util'
import * as Api from './api'
export * from './util'
export * from './api'
export const ERROR_MSG = {
  smsService: {
    otpFail: 'ส่ง OTP ไม่สำเร็จ',
  },
  NEED_MCN_QR: 'กรุณาใช้ QR จากแอพหมอชนะ',
  alreadyCheckedIn: 'นักท่องเที่ยวเคยลงทะเบียนไปแล้ว ไม่สามารถ Checkin ซำ้ได้',
  otp: Api.OTP.ERROR_MSG,
}

type Res = { status: number; res: BasicAPIResponse<any> }
export const RES = {
  success: {
    status: 200,
    res: {
      code: 0,
      message: 'ยิงสำเร็จ',
    },
  } as Res,
  unauthorize: {
    status: 503,
    res: {
      code: 111,
      message: 'Unauthorized: กรุณา Logout และ Login ใหม่',
    },
  } as Res,
  error: {
    status: 500,
    res: {
      code: 111,
      message: 'Server Error',
    },
  } as Res,
}
