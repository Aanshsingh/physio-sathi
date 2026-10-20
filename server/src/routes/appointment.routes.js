import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { createAppointment, listNearbyRequests } from '../controllers/appointment.controller.js'

const router = Router()
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

router.post('/', createLimiter, createAppointment)
router.get('/nearby', listNearbyRequests)

export default router