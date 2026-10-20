import { Router } from 'express'
import { compare } from '../controllers/cost.controller.js'

const router = Router()
router.post('/compare', compare)

export default router
