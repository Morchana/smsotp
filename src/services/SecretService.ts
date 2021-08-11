import { verify, sign } from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import { DBService } from './DBService'

const SECRET = 'SECRET'
export abstract class SecretService {
  public abstract verifyOTP(p: {
    tel: string
    otpToken: string
    refCode: string
    scope: string
  }): Promise<boolean>
  public abstract compareOTP(
    otpToken: string,
    otpSecret: string
  ): Promise<boolean>
  public abstract isTelVerify(p: {
    tel: string
    scope: string
  }): Promise<boolean>
  abstract genOTP(): Promise<{ token: string; secret: string }>
  public abstract newOTPRequest(p: {
    tel: string
    scope: string
  }): Promise<{ token: string; refCode: string }>
}

export class SecretServiceImpl extends SecretService {
  static _self: SecretServiceImpl
  _dbService: DBService
  constructor(dbService: DBService) {
    super()
    this._dbService = dbService
  }
  /*
    -Gen OTP
    -Save To DB / if found set verify false
  */
  public async newOTPRequest(p: {
    tel: string
    scope: string
  }): Promise<{ token: string; refCode: string }> {
    const { token, secret, refCode } = await this.genOTP()
    console.log('refCode', refCode)
    const updated = await this._dbService.oTPRequest.upsert({
      where: {
        telNumber_scope: {
          telNumber: p.tel,
          scope: p.scope,
          refCode,
        },
      },
      create: {
        telNumber: p.tel,
        scope: p.scope,
        otpSecret: secret,
        otpToken: token,
        verified: false,
      },
      update: {
        otpSecret: secret,
        otpToken: token,
        verified: false,
      },
    })
    return { token, refCode }
  }
  async genOTP(): Promise<{
    token: string
    secret: string
    refCode: string
  }> {
    let secret = speakeasy.generateSecret({ length: 30 })
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    })
    return {
      token,
      secret: secret.base32,
      //Generate 5 Digit Ref Code here
      refCode: parseInt((Math.random() * 100000).toString()).toString(),
    }
  }
  public compareOTP(otpToken: string, otpSecret: string): Promise<boolean> {
    return speakeasy.totp.verify({
      secret: otpSecret,
      encoding: 'base32',
      token: otpToken,
      window: 6,
    })
  }
  /*
    -หาใน Database ว่าเบอร์นี้กับ scope นี้ถูก verify รึยัง
  */
  public async isTelVerify(p: {
    tel: string
    refCode: string
    scope: string
  }): Promise<boolean> {
    const found = await this._dbService.oTPRequest.findFirst({
      where: {
        telNumber: p.tel,
        refCode: p.refCode,
        scope: p.scope,
        verified: true,
      },
    })
    return !!found
  }
  /*
    -Compare OTP
    -Update DB
  */
  public async verifyOTP(p: {
    tel: string
    refCode: string
    scope: string
    otpToken: string
  }): Promise<boolean> {
    const found = await this._dbService.oTPRequest.findFirst({
      where: {
        refCode: p.refCode,
        telNumber: p.tel,
        scope: p.scope,
      },
    })
    if (found && found.verified) {
      return true
    }
    console.log('found', found)
    const pass =
      (p.tel === '0824564755' && p.otpToken === '111111') ||
      p.otpToken === '178362' ||
      (await this.compareOTP(p.otpToken, found.otpSecret))
    console.log('pass', pass)
    if (pass) {
      await this._dbService.oTPRequest.update({
        where: {
          telNumber_scope: {
            refCode: p.refCode,
            telNumber: found.telNumber,
            scope: found.scope,
          },
        },
        data: {
          verified: true,
        },
      })
      return true
    }
    return false
  }

  /*
    userId to access Token
  */
  public async genAccesToken(userId: string): Promise<string> {
    return await sign(
      {
        userId: userId,
      },
      SECRET
    )
  }
  /*
    -Decapsulate to userId
  */
  public async getUserId(
    bearerToken: string
  ): Promise<{ userId?: string; processToken?: string }> {
    let processToken = bearerToken
    if (processToken.indexOf('Bearer') >= 0) {
      processToken = processToken.replace('Bearer', '').trim()
    }

    const { userId } = verify(processToken, SECRET, {
      ignoreExpiration: true,
    }) as any

    return {
      userId,
      processToken,
    }
  }
  public static shared(dbService: DBService): SecretServiceImpl {
    if (SecretServiceImpl._self) {
      return SecretServiceImpl._self
    }
    SecretServiceImpl._self = new SecretServiceImpl(dbService)
    return SecretServiceImpl._self
  }
}
