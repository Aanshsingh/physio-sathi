import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Physiotherapist } from '../models/Physiotherapist.model.js'
import { EquipmentListing } from '../models/equipmentListing.model.js'
import { extractRequirements, sanitizeContext, isMedicalAsk } from '../services/ai.service.js'
import { matchProviders, escapeRegex } from '../services/matching.service.js'
import { searchExternalEquipment } from '../services/equipment.service.js'

function readMessage(req) {
  const message = String(req.body.message || '').trim()
  if (message.length < 2 || message.length > 500) throw new ApiError(400, 'Message must be 2-500 characters')
  return message
}

export const requirementsOnly = asyncHandler(async (req, res) => {
  const message = readMessage(req)
  const data = await extractRequirements(message, sanitizeContext(req.body.context))
  res.status(200).json(new ApiResponse(200, data, 'Requirements extracted'))
})

function buildReply({ r, providers, equipment, followUp, medical }) {
  const lines = []
  const seen = []
  if (r.city) seen.push(r.locality ? `${r.locality}, ${r.city}` : r.city)
  if (r.visitType && r.visitType !== 'any') seen.push(`${r.visitType} visit`)
  if (r.budget) seen.push(`budget about Rs. ${r.budget}`)
  if (r.equipment) seen.push(`${r.equipment} (${r.equipmentMode || 'rent'})`)
  if (seen.length) lines.push(`Here is what I understood: ${seen.join(', ')}.`)

  if (r.city) {
    lines.push(
      providers.length
        ? `I found ${providers.length} physio${providers.length === 1 ? '' : 's'} listed for your area, ranked by how well they match.`
        : `I could not find a listed physio for those filters in ${r.city}. Try a higher budget or a different visit type.`
    )
  }
  if (equipment) {
    lines.push(
      `For ${r.equipment}, I show our sample listings and live web results. Web results are not verified, so check each source.`
    )
  }
  if (medical) {
    lines.push('I cannot diagnose, prescribe treatment, or decide which equipment you need. Please ask a qualified physiotherapist or clinician about that.')
  }
  if (followUp) lines.push(followUp)
  if (!lines.length) lines.push('Tell me your city, whether you want a home or centre visit, your budget, and any equipment you need.')
  return lines.join(' ')
}

export const assistant = asyncHandler(async (req, res) => {
  const message = readMessage(req)
  const medical = isMedicalAsk(message)
  const { requirements: r, followUp, source } = await extractRequirements(message, sanitizeContext(req.body.context))

  let providers = []
  if (r.city) {
    const list = await Physiotherapist.find({ profileStatus: 'active', city: new RegExp(`^${escapeRegex(r.city)}$`, 'i') }).lean()
    providers = matchProviders(list, {
      city: r.city, locality: r.locality, pincode: r.pincode, visitType: r.visitType || 'any', budget: r.budget,
    }).slice(0, 3)
  }

  let equipment = null
  if (r.equipment) {
    const mode = r.equipmentMode || 'rent'
    const rx = new RegExp(escapeRegex(r.equipment), 'i')
    const filter = { sourceType: 'internal', $or: [{ name: rx }, { category: rx }, { description: rx }] }
    if (mode === 'buy') Object.assign(filter, { listingType: { $in: ['sale', 'both'] }, condition: 'new' })
    if (mode === 'rent') filter.listingType = { $in: ['rent', 'both'] }
    if (mode === 'used') filter.condition = 'used'

    const internal = await EquipmentListing.find(filter).limit(3).lean()
    let external = []
    let externalError = ''
    try {
      const found = await searchExternalEquipment({ query: r.equipment, mode, city: r.city })
      external = found.results.slice(0, 3)
    } catch (err) {
      externalError = err.message || 'External web research is unavailable right now.'
    }
    equipment = { mode, internal, external, externalError }
  }

  const reply = buildReply({ r, providers, equipment, followUp, medical })
  res.status(200).json(new ApiResponse(200, { requirements: r, source, followUp, reply, providers, equipment, medicalNotice: medical }, 'Assistant reply'))
})
