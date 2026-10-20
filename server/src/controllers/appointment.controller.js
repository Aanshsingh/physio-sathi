import mongoose from 'mongoose'
import { AppointmentRequest } from '../models/appointmentRequest.js'
import { Physiotherapist } from '../models/Physiotherapist.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { escapeRegex } from '../services/matching.service.js'
import { rankNearby } from '../services/appointment.service.js'

const TIMES = ['morning', 'afternoon', 'evening', 'flexible']

export const createAppointment = asyncHandler(async (req, res) => {
  const b = req.body
  const providerId = String(b.providerId || '')
  const patientName = String(b.patientName || '').trim()
  const phone = String(b.phone || '').replace(/[\s-]/g, '')
  const city = String(b.city || '').trim()
  const locality = String(b.locality || '').trim()
  const pincode = String(b.pincode || '').trim()
  const visitType = b.visitType
  const preferredTime = b.preferredTime || 'flexible'
  const note = String(b.note || '').trim()

  if (!mongoose.isValidObjectId(providerId)) throw new ApiError(400, 'Invalid provider')
  if (patientName.length < 2 || patientName.length > 80) throw new ApiError(400, 'Please enter your name (2-80 characters)')
  if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) throw new ApiError(400, 'Please enter a valid 10-digit mobile number')
  if (!city) throw new ApiError(400, 'city is required')
  if (pincode && !/^\d{6}$/.test(pincode)) throw new ApiError(400, 'pincode must be 6 digits')
  if (locality.length > 60) throw new ApiError(400, 'locality is too long')
  if (!['home', 'centre'].includes(visitType)) throw new ApiError(400, 'visitType must be home or centre')
  if (!TIMES.includes(preferredTime)) throw new ApiError(400, `preferredTime must be one of: ${TIMES.join(', ')}`)
  if (note.length > 200) throw new ApiError(400, 'note must be 200 characters or fewer')

  const date = new Date(`${String(b.preferredDate || '')}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) throw new ApiError(400, 'Please choose a preferred date')
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  if (date < today) throw new ApiError(400, 'Preferred date cannot be in the past')

  const provider = await Physiotherapist.findOne({ _id: providerId, profileStatus: 'active' }).lean()
  if (!provider) throw new ApiError(404, 'Provider not found')
  if (!provider.visitTypes?.includes(visitType)) throw new ApiError(400, `This physio does not offer ${visitType} visits`)

  const doc = await AppointmentRequest.create({
    provider: provider._id, patientName, phone, city, locality, pincode: pincode || undefined,
    visitType, preferredDate: date, preferredTime, note: note || undefined,
  })

  res.status(201).json(
    new ApiResponse(
      201,
      { id: doc._id, status: doc.status, providerName: provider.name },
      'Request received. It is not a confirmed appointment until the physio accepts it.'
    )
  )
})

// Demo view for physios. Returns no personal details.
export const listNearbyRequests = asyncHandler(async (req, res) => {
  const city = String(req.query.city || '').trim()
  const locality = String(req.query.locality || '').trim()
  const pincode = String(req.query.pincode || '').trim()
  if (!city) throw new ApiError(400, 'city is required')
  if (pincode && !/^\d{6}$/.test(pincode)) throw new ApiError(400, 'pincode must be 6 digits')

  const requests = await AppointmentRequest.find({
    status: 'pending',
    city: new RegExp(`^${escapeRegex(city)}$`, 'i'),
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()

  const ranked = rankNearby(requests, { locality, pincode }).slice(0, 50)
  res.status(200).json(new ApiResponse(200, { count: ranked.length, requests: ranked }, 'Nearby requests (demo view)'))
})
