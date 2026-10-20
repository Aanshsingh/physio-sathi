import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { compareCosts } from '../services/cost.service.js'

const MONEY_FIELDS = ['homeFee', 'centreFee', 'homeTravelPerVisit', 'centreTravelPerVisit', 'rentalRatePerDay', 'rentalExtra', 'purchasePrice']
const MAX_MONEY = 10_000_000

function readNumber(body, key) {
  const v = body[key]
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  if (!Number.isFinite(n) || n < 0) throw new ApiError(400, `${key} must be a non-negative number`)
  return n
}

export const compare = asyncHandler(async (req, res) => {
  const input = {}
  for (const key of MONEY_FIELDS) {
    const n = readNumber(req.body, key)
    if (n !== undefined) {
      if (n > MAX_MONEY) throw new ApiError(400, `${key} is too large`)
      input[key] = n
    }
  }

  const sessions = readNumber(req.body, 'sessions')
  if (sessions === undefined || !Number.isInteger(sessions) || sessions < 1 || sessions > 200) {
    throw new ApiError(400, 'sessions must be a whole number from 1 to 200')
  }
  input.sessions = sessions

  const days = readNumber(req.body, 'rentalDays')
  if (days !== undefined) {
    if (!Number.isInteger(days) || days < 1 || days > 3650) throw new ApiError(400, 'rentalDays must be a whole number from 1 to 3650')
    input.rentalDays = days
  }

  res.status(200).json(new ApiResponse(200, compareCosts(input), 'Cost estimates'))
})
