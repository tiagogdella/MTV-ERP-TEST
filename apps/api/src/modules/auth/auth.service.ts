import { prisma } from '@/database/prisma'
import { AppError } from '@/shared/errors/AppError'
import { hashPassword, comparePassword } from '@/shared/utils/hash'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/shared/utils/jwt'

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
    const refreshToken = generateRefreshToken(existing.id)

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: existing.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    })

    const { passwordHash, ...user } = existing 
    return { token: accessToken, user, refreshToken }
}

export const getMe = async (userId: string) => {
    const existing = await prisma.user.findUnique({where: { id : userId }})
    if (!existing) throw new AppError('User not found', 404)

    const { passwordHash, ...user } = existing
    return user
}

export const logout = async (refreshToken: string) => {
    const token = await prisma.refreshToken.findUnique({ where: { token: refreshToken }})
    if (!token) throw new AppError('Invalid token', 401)

        await prisma.refreshToken.update({
            where: { token: refreshToken },
            data: { revoked: true },
        })
}

export const refresh = async (refreshToken: string) => {
    const tokenRecord = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!tokenRecord || tokenRecord.revoked) throw new AppError('Invalid token', 401)
    if (tokenRecord.expiresAt < new Date()) throw new AppError('Token expired', 401)
    
    verifyRefreshToken(refreshToken)
    const accessToken = generateAccessToken(tokenRecord.userId)
    return { accessToken }    
}