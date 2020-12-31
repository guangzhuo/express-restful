import { Application } from 'express'
import { user } from './modules/user/router'
import { role } from './modules/role/router'
import { log } from './modules/log/router'
import { authority } from './modules/authority/route'
import { authorizations } from './modules/authorizations/router'
export function initRouter(app: Application) {
  app.use('/authorities', authority)
  app.use(authorizations)
  app.use('/users', user)
  app.use('/roles', role)
  app.use('/logs', log)
}
