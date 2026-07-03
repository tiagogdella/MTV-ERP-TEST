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