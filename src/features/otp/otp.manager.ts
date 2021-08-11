import { SecretService } from '../../services/SecretService'
import { SMSService } from '../../services/SMSService'

const OTP_SCOPE = 'default'
export abstract class OTPManager {
  protected _smsService: SMSService
  protected _secretService: SecretService
  public abstract requestOTP(telNumber: string): Promise<{ success: boolean }>
  public abstract verifyOTP(
    telNumber: string,
    refCode: string,
    otpToken: string
  ): Promise<{ success: boolean }>
}

export class OTPManagerImpl extends OTPManager {
  /*
    -save ลงตาราง otp (SCOPE:staff)
    -ส่ง sms ไปยังเบอร์ที่กำหนด
  */

  public async requestOTP(
    telNumber: string
  ): Promise<{ success: boolean; token?: string; refCode: string }> {
    const result = await this._secretService.newOTPRequest({
      tel: telNumber,
      scope: OTP_SCOPE,
    })
    await this._smsService.sendMessage(
      telNumber,
      `Your OTP is : ${result.token} (REF: ${result.refCode})`
    )
    return { success: true, refCode: result.refCode, token: result.token }
  }
  /*
    -ค้นหาเบอร์ใน database table otp (scope:Staff)
    -เปรียบเทียบ otp token กับ secret ที่เจอ
  */
  public async verifyOTP(
    telNumber: string,
    refCode: string,
    otpToken: string
  ): Promise<{ success: boolean }> {
    const result = await this._secretService.verifyOTP({
      tel: telNumber,
      otpToken: otpToken,
      refCode: refCode,
      scope: OTP_SCOPE,
    })
    if (!result) {
      throw 'Wrong OTP'
    }
    return {
      success: result,
    }
  }
  static _self?: OTPManagerImpl
  public static shared(p: {
    smsService: SMSService
    secretService: SecretService
  }): OTPManagerImpl {
    if (OTPManagerImpl._self) {
      return OTPManagerImpl._self
    }
    OTPManagerImpl._self = new OTPManagerImpl(p.smsService, p.secretService)
    return OTPManagerImpl._self
  }
  constructor(smsService: SMSService, secretService: SecretService) {
    super()

    this._smsService = smsService
    this._secretService = secretService
  }
}
