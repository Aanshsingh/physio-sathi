import mongoose from 'mongoose'
import { Physiotherapist } from './../models/Physiotherapist.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { matchProviders, escapeRegex } from '../services/matching.service.js'

const VISIT_TYPES = ['home', 'centre', 'any']

export const getProviders = asyncHandler(async (req, res) => {
  const { city, locality, visitType, maxFee } = req.query
  const filter = { profileStatus: 'active' }

  if (city) filter.city = new RegExp(`^${escapeRegex(String(city).trim())}$`, 'i')
  if (locality) filter.serviceAreas = new RegExp(`^${escapeRegex(String(locality).trim())}$`, 'i')
  if (visitType && visitType !== 'any') {
    if (!VISIT_TYPES.includes(visitType)) throw new ApiError(400, 'visitType must be home, centre or any')
    filter.visitTypes = visitType
  }
  if (maxFee !== undefined && maxFee !== '') {
    const fee = Number(maxFee)
    if (Number.isNaN(fee) || fee < 0) throw new ApiError(400, 'maxFee must be a positive number')
    if (visitType && visitType !== 'any') filter[`fees.${visitType}`] = { $lte: fee }
    else filter.$or = [{ 'fees.home': { $lte: fee } }, { 'fees.centre': { $lte: fee } }]
  }

  const providers = await Physiotherapist.find(filter).sort({ name: 1 }).lean()
  res.status(200).json(new ApiResponse(200, { count: providers.length, providers }, 'Providers'))
})

export const getProviderById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'Invalid provider id')
  const provider = await Physiotherapist.findOne({ _id: req.params.id, profileStatus: 'active' }).lean()
  if (!provider) throw new ApiError(404, 'Provider not found')
  res.status(200).json(new ApiResponse(200, provider, 'Provider'))
})

export const matchProvidersController = asyncHandler(async (req, res) => {
  const city = String(req.body.city || '').trim()
  const locality = String(req.body.locality || '').trim()
  const pincode = String(req.body.pincode || '').trim()
  const visitType = req.body.visitType || 'any'
  const budget = req.body.budget === undefined || req.body.budget === null || req.body.budget === ''
    ? null
    : Number(req.body.budget)

  if (!city) throw new ApiError(400, 'city is required')
  if (!VISIT_TYPES.includes(visitType)) throw new ApiError(400, 'visitType must be home, centre or any')
  if (pincode && !/^\d{6}$/.test(pincode)) throw new ApiError(400, 'pincode must be 6 digits')
  if (budget !== null && (Number.isNaN(budget) || budget < 0)) throw new ApiError(400, 'budget must be a positive number')

  const cityRegex = new RegExp(`^${escapeRegex(city)}$`, 'i')
  const providers = await Physiotherapist.find({ profileStatus: 'active', city: cityRegex }).lean()

  const results = matchProviders(providers, { city, locality, pincode, visitType, budget })
  res.status(200).json(
    new ApiResponse(200, { criteria: { city, locality, pincode, visitType, budget }, count: results.length, results }, 'Matched providers')
  )
})