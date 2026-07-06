import { prisma } from '@/database/prisma'
import { AppError } from '@/shared/errors/AppError'
import { Role } from '@/generated/prisma/enums'


export const findAll = () => {
    return prisma.user.findMany({ 
        where: { isActive: true }, 
        omit: { passwordHash: true },
    })
} 

export const findById = async (id: string) => {
    const userId =  await prisma.user.findUnique({ where: { id } })

    if (!userId) {throw new AppError('User not found', 404)}

    const {passwordHash, ... user} = userId
    return user
}

export const update = async (id: string, data: { name?: string; role?: Role }) => {
    const { passwordHash, ...user } = await prisma.user.update({
        where: { id },
        data,
    })
    return user
}

export const deactivate = async (id: string) => {
    await prisma.user.update({
        where: { id },
        data: { isActive : false },
    })
}
