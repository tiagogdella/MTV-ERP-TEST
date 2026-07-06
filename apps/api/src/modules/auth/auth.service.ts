import { prisma } from '@/database/prisma'
import { AppError } from '@/shared/errors/AppError'
import { hashPassword, comparePassword } from '@/shared/utils/hash'
import { generateAccessToken } from '@/shared/utils/jwt'

export const register = async (name: string, email: string, password: string) => {
    
    const existing = await prisma.user.findUnique({ where: { email }})
    if (existing) throw new AppError('Email already in use', 409)
    
    const hashPass = await hashPassword(password)

    const { passwordHash, ...user } = await prisma.user.create({
        data: {
            name: name,
            email: email,
            passwordHash: hashPass,
        }
    })

    return user
}

export const login = async (email: string, password: string) => {
    const existing =  await prisma.user.findUnique({ where: { email }})
    if (!existing) throw new AppError('Invalid credentials', 401)

    const passwordComparing = await comparePassword(password, existing.passwordHash)
    if (!passwordComparing) throw new AppError('Invalid credentials', 401)
    
    const accessToken = generateAccessToken(existing.id)

    const { passwordHash, ...user } = existing 
    return { token: accessToken, user }
}