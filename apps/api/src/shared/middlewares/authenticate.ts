import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError"
import { verifyAccessToken } from "@/shared/utils/jwt"

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new AppError('No token provided', 401)
    
    const token = authHeader.split(' ')[1]
    const { sub } = verifyAccessToken(token)

    req.userId = sub
    next()

}
