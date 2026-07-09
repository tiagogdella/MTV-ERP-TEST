import { Request, Response } from "express";
import * as authService from './auth.service';

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    const user = await authService.register(name, email, password)
    res.status(201).json(user)
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await authService.login(email, password)
    res.status(200).json(user)
}

export const me = async (req: Request, res: Response) => {
    const user = await authService.getMe(req.userId)
    res.status(200).json(user)
}

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    await authService.logout(refreshToken)
    res.status(204).send()
}

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    const result = await authService.refresh(refreshToken)
    res.status(200).json(result)
}
