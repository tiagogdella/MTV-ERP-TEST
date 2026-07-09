import { Router } from "express";
import * as authController from './auth.controller';
import { authenticate } from "@/shared/middlewares/authenticate";

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authenticate, authController.me)
router.post('/logout', authenticate, authController.logout)
router.post('/refresh', authController.refresh)

export default router