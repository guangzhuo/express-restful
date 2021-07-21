import * as express from 'express'
import * as Sentry from '@sentry/node'
import * as Integrations from '@sentry/integrations'

global.__rootdir__ = __dirname || process.cwd()

const request = (app: express.Application) => {
  // 只有在非开发环境下才启用 sentry
  const { SENTRY_DSN, NODE_ENV, SENTRY_RELEASE } = process.env

  if (NODE_ENV !== 'development') {
    if (!SENTRY_DSN) {
      console.warn(`缺少 SENTRY_DSN`)
      return
    }

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: NODE_ENV,
      release: SENTRY_RELEASE,
      integrations: [
        new Integrations.RewriteFrames({
          root: global.__rootdir__,
        }),
      ],
    })
    app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)
  }
}

const error = (app: express.Application) => {
  if (process.env.NODE_ENV !== 'development') {
    app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler)
  }
}

export { request, error }
