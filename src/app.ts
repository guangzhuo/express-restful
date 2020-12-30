import express, { Application, Request, Response, NextFunction } from 'express'
import middleware from './middleware'
import * as Sentry from './util/sentry'
import * as DB from './util/db'
import * as router from './router'
import { Error } from './util/types'

export const getApp = (): Application => {
  const app: Application = express()

  // 链接数据库
  DB.connect()

  // 中间件
  middleware(app)

  // sentry
  Sentry.request(app)

  // router
  router.initRouter(app)

  // 错误处理
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const { message, errors, status = 500, name } = error
    if (name === 'UnauthorizedError') {
      return res.status(401).json({
        message: '账号未登录或已失效',
      })
    }
    res.status(status).json({
      message: message,
      errors: errors,
    })
    next()
  })

  return app
}
