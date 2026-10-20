
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { assistant, requirementsOnly } from '../controllers/ai.controller.js'

const router = Router()
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many assistant requests. Please wait a few minutes.' },
})

router.post('/requirements', aiLimiter, requirementsOnly)
router.post('/assistant', aiLimiter, assistant)

export default router
