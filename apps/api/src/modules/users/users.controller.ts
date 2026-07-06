import { Request, Response } from "express";
import * as usersService from "./users.service";

export const findAll = async (req: Request, res: Response) => {
    const users = await usersService.findAll();
    res.status(200).json(users)
}

export const findById = async (req: Request, res: Response) => {
    const id = req.params.id

    const user = await usersService.findById(id)

    res.status(200).json(user)
}

export const update = async (req: Request, res: Response) => {
    const id = req.params.id
    const body = req.body

    const user = await usersService.update(id, body)

    res.status(200).json(user)
}

export const deactivate = async (req: Request, res: Response) => {
    const id = req.params.id

    const user = await usersService.deactivate(id)

    res.status(204).send()
}