import { Router } from "express";
import * as usersController from "./users.controller";
import { authenticate } from "@/shared/middlewares/authenticate";

const router = Router()

router.get('/', authenticate, usersController.findAll)
router.get('/:id', authenticate, usersController.findById)
router.put('/:id', authenticate, usersController.update)
router.patch('/:id/deactivate', authenticate, usersController.deactivate)

export default router