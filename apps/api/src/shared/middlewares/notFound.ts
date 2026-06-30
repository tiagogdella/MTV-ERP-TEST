import { Request, Response, NextFunction } from 'express'
import { NotFoundError } from '../errors/AppError'

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`))
}
