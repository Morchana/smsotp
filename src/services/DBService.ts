import redis from 'redis'
export abstract class DBService {
  oTPRequest: {
    upsert: (p: {
      where: {
        telNumber_scope: {
          telNumber: string
          scope: string
          refCode: string
        }
      }
      create: {
        telNumber: string
        scope: string

        otpSecret: string
        otpToken: string
        verified: boolean
      }
      update: {
        otpSecret: string
        otpToken: string
        verified: boolean
      }
    }) => Promise<boolean>
    findFirst: (p: {
      where: {
        refCode: string
        telNumber: string
        scope: string
        verified?: boolean
      }
    }) => Promise<{
      telNumber: string
      scope: string
      otpSecret: string
      otpToken: string
      verified: boolean
    } | null>
    update: (p: {
      where: {
        telNumber_scope: {
          refCode: string
          telNumber: string
          scope: string
        }
      }
      data: {
        verified: boolean
      }
    }) => Promise<boolean>
  }
}

export class RedisDBService extends DBService {
  static _self?: RedisDBService
  static EXPIRE_SECONDS: number = 60 * 5
  client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: 6379,
  })
  constructor() {
    super()
  }
  async _init() {}

  oTPRequest = {
    upsert: async (p) => {
      const key =
        p.where.telNumber_scope.scope +
        '/' +
        p.where.telNumber_scope.telNumber +
        '/' +
        p.where.telNumber_scope.refCode
      try {
        console.log('key', key)
        await new Promise<boolean>((r, rj) => {
          this.client.set(key, JSON.stringify({ ...p.create }), () => {
            this.client.expire(key, RedisDBService.EXPIRE_SECONDS)
            r(true)
          })
        })
      } catch {}

      return true
    },
    findFirst: async (p) => {
      const key =
        p.where.scope + '/' + p.where.telNumber + '/' + p.where.refCode
      try {
        console.log('key', key)
        const result = await new Promise<string>((r, rj) => {
          this.client.get(key, (error, s) => {
            if (error || !s) {
              return rj()
            }
            return r(s)
          })
        })
        return JSON.parse(result)
      } catch {}
      return null
    },
    update: async (p) => {
      console.log('p', p)
      const key =
        p.where.telNumber_scope.scope +
        '/' +
        p.where.telNumber_scope.telNumber +
        '/' +
        p.where.telNumber_scope.refCode
      try {
        console.log('key', key)
        await new Promise<boolean>((r, rj) => {
          this.client.set(key, JSON.stringify({ ...p.data }), () => {
            r(true)
          })
        })
      } catch {}

      return true
    },
  } as DBService['oTPRequest']
  public static shared(): RedisDBService {
    if (RedisDBService._self) {
      return RedisDBService._self
    }
    RedisDBService._self = new RedisDBService()
    return RedisDBService._self
  }
}
