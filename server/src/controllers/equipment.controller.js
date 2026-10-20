import { EquipmentListing } from '../models/equipmentListing.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { searchExternalEquipment } from '../services/equipment.service.js'
import { escapeRegex } from '../services/matching.service.js'

const MODES = ['buy', 'rent', 'used']

// Internal listings from our own database
export const getEquipment = asyncHandler(async (req, res) => {
  const mode = req.query.mode || 'buy'
  const q = String(req.query.q || '').trim().slice(0, 100)
  const city = String(req.query.city || '').trim().slice(0, 50)

  if (!MODES.includes(mode)) throw new ApiError(400, `mode must be one of: ${MODES.join(', ')}`)

  const filter = { sourceType: 'internal' }
  if (mode === 'buy') Object.assign(filter, { listingType: { $in: ['sale', 'both'] }, condition: 'new' })
  if (mode === 'rent') Object.assign(filter, { listingType: { $in: ['rent', 'both'] } })
  if (mode === 'used') Object.assign(filter, { condition: 'used' })
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i')
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i')
    filter.$or = [{ name: rx }, { category: rx }, { description: rx }]
  }

  const listings = await EquipmentListing.find(filter).sort({ name: 1 }).lean()
  res.status(200).json(new ApiResponse(200, { count: listings.length, listings }, 'Internal equipment listings'))
})

// External web research through TinyFish
export const searchEquipment = asyncHandler(async (req, res) => {
  const query = String(req.body.query || '').trim()
  const mode = req.body.mode || 'buy'
  const city = String(req.body.city || '').trim().slice(0, 50)

  if (query.length < 2 || query.length > 100) {
    throw new ApiError(400, 'Query must be 2-100 characters')
  }
  if (!MODES.includes(mode)) {
    throw new ApiError(400, `mode must be one of: ${MODES.join(', ')}`)
  }

  const data = await searchExternalEquipment({ query, mode, city })
  res.status(200).json(new ApiResponse(200, data, 'External equipment results'))
})