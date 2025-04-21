import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const verifyToken = async (req, res, next) => {
  try {
    let token

    // Get token from header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Your account has been deactivated. Please contact an administrator.",
        })
      }

      // Update last active timestamp
      user.lastActive = Date.now()
      await user.save({ validateBeforeSave: false })

      // Add user to request object
      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or has expired",
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}
