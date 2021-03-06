/**
 * TODO: 对下面的校验规则需要整理
 */

import { Request, Response, NextFunction } from 'express'
import { Schema } from 'express-validator'
import { isOptional, optional } from '../../validator'
import { checkSchema } from '../../validator/checkSchema'

// 校验规则
export const createRules = (method: HttpMethods = 'POST') => {
  // patch 可选
  const optionalOrNotEmpty = isOptional(method)

  const rules: Schema = {
    title: {
      in: ['body'],
      ...optionalOrNotEmpty,
      isString: {
        errorMessage: '值是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 2, max: 10 },
        errorMessage: '值长度在2-10位',
      },
      escape: true,
    },
    desc: {
      in: ['body'],
      optional,
      isString: {
        errorMessage: '值是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 10, max: 40 },
        errorMessage: '值长度在10-40位',
      },
      default: {
        options: '',
      },
      escape: true,
    },
    status: {
      in: ['body'],
      optional,
      isIn: {
        options: [0, 1],
        errorMessage: '值只能是 0 和 1 ',
      },
      default: {
        options: 1,
      },
    },
    authority_ids: {
      in: ['body'],
      optional,
      isArray: {
        errorMessage: '值是一个数组',
      },
      default: {
        options: [],
      },
    },
    'authority_ids.*': {
      in: ['body'],
      optional,
      isMongoId: {
        errorMessage: '值有非法ID',
      },
      default: {
        options: [],
      },
    },
  }
  return rules
}

// 参数校验
export const validator = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method as HttpMethods
  return checkSchema(createRules, method)(req, res, next)
}
