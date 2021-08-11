import { SecretServiceImpl } from './services/SecretService'

import { JitasaSMSService } from './services/SMSService'

import { OTPManagerImpl } from './features/otp/otp.manager'
import { RedisDBService } from './services/DBService'
export const dbService = RedisDBService.shared()
export const otpManager = OTPManagerImpl.shared({
  smsService: JitasaSMSService.shared(),
  secretService: SecretServiceImpl.shared(dbService),
})
