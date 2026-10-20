import { Router } from 'express'
import { getEquipment, searchEquipment } from '../controllers/equipment.controller.js'

const router = Router()
router.get('/', getEquipment)
router.post('/search', searchEquipment)

export default router
