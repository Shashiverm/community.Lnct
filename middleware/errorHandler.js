export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log to console for dev
  if (process.env.NODE_ENV === "development") {
    console.error(err)
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message)
    error = { message, statusCode: 400 }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = { message: "Invalid token. Please log in again.", statusCode: 401 }
  }

  if (err.name === "TokenExpiredError") {
    error = { message: "Your token has expired. Please log in again.", statusCode: 401 }
  }

  // Default to 500 server error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}
