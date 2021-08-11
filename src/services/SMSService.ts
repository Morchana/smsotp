import { ERROR_MSG } from '../const'
import axios from 'axios'

export abstract class SMSService {
  static _self?: SMSService
  public abstract sendMessage(tel: string, message: string): Promise<boolean>
}

export class JitasaSMSService extends SMSService {
  /*
    -Send sms
    **Wait for credentials
  */
  public async sendMessage(_tel: string, message: string): Promise<boolean> {
    const tel = _tel.split('+')[0]
    var newPhone = ''
    if (tel[0].toString() == '0') {
      newPhone = '+66' + tel.substr(1)
    } else {
      newPhone = '+66' + tel
    }
    console.log('tel', newPhone)
    var querystring = require('querystring')

    try {
      const res = await axios.post(
        `${process.env.MCN_SMS_SERVICE_URL}`,
        querystring.stringify({
          user: process.env.SMS_USERNAME,
          pass: process.env.SMS_PASSWORD,
          from: 'MorChana',
          to: newPhone,
          msg: message,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      console.log('SMS SUCCESS', res)
    } catch (error) {
      console.log('SMS ERROR', error)
      throw ERROR_MSG.smsService.otpFail
    }

    return true
  }
  public static shared(): JitasaSMSService {
    if (JitasaSMSService._self) {
      return JitasaSMSService._self
    }
    JitasaSMSService._self = new JitasaSMSService()
    return JitasaSMSService._self
  }
}
