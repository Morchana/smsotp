import { AsyncRouterInstance } from 'express-async-router'
import { OTPControllers } from './features/otp/otp.controller'

export const setupRoutes = (router: AsyncRouterInstance) => {  
  OTPControllers(router)
}
console.log('Setup Routes')
