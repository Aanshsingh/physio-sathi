export class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', code = null, details = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.success = false
  }
}

