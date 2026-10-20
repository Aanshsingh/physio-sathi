import { Router } from 'express'
import { getProviders, getProviderById, matchProvidersController } from '../controllers/provider.controller.js'

const router = Router()
router.get('/', getProviders)
router.post('/match', matchProvidersController)
router.get('/:id', getProviderById)

export default router