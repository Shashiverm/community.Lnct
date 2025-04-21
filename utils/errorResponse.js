/**
 * Custom error class for API responses
 * @class ErrorResponse
 * @extends Error
 */
class ErrorResponse extends Error {
  /**
   * Create an ErrorResponse
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Object} [data=null] - Additional error data
   */
  constructor(message, statusCode, data = null) {
    super(message)
    this.statusCode = statusCode
    this.data = data

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ErrorResponse
