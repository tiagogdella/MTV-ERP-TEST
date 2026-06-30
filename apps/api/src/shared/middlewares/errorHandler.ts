import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message
            },
        })
    }

    console.log(err)

    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            MESSAGE: 'An unexpected error occurred',
        },
    })
}
