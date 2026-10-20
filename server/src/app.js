import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import equipmentRoutes from './routes/equipment.routes.js'
import providerRoutes from './routes/provider.routes.js'
import costRoutes from './routes/cost.routes.js'
import appointmentRoutes from './routes/appointment.routes.js'
import aiRoutes from './routes/ai.routes.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'
import { ApiResponse } from './utils/ApiResponse.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json({ limit: '100kb' }))
app.use('/api', rateLimit({ windowMs: 60_000, max: 100 }))

app.get('/api/health', (req, res) => {
  const db = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  res.json(new ApiResponse(200, { service: 'physio-sathi-api', db, time: new Date().toISOString() }, 'OK'))
})

app.use('/api/equipment', equipmentRoutes)
app.use('/api/providers', providerRoutes)
app.use('/api/costs', costRoutes)
app.use('/api/appointment-requests', appointmentRoutes)
app.use('/api/ai', aiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app