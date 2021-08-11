import { Request, Response } from 'express'
export type Req<T> = Request<{}, {}, T>
export type Res<T> = Response<T>
