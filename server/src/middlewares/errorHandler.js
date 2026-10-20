import { ApiError } from '../utils/ApiError.js'

export const notFound = (req, res, next) =>
  next(new ApiError(404, `Route not found: ${req.originalUrl}`))

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  if (statusCode >= 500) console.error(err)
  res.status(statusCode).json({
    success: false,
    message: err.statusCode ? err.message : 'Something went wrong',
    code: err.code || undefined,
    details: err.details || undefined,
  })
}