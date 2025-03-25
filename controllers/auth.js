import User from "../models/User.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import sendEmail from "../utils/sendEmail.js"

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Set token cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id)

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString("hex")

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      verificationToken,
    })

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`
    const message = `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" target="_blank">Verify Email</a>
    `

    try {
      await sendEmail({
        email: user.email,
        subject: "LNCT Community - Email Verification",
        message,
      })
    } catch (err) {
      console.error("Email could not be sent", err)
      user.verificationToken = undefined
      await user.save({ validateBeforeSave: false })

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      })
    }

    // Send token response
    sendTokenResponse(user, 201, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      })
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Send token response
    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    data: {},
  })
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "There is no user with that email",
      })
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save({ validateBeforeSave: false })

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    const message = `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `

    try {
      await sendEmail({
        email: user.email,
        subject: "LNCT Community - Password Reset",
        message,
      })

      res.status(200).json({
        success: true,
        message: "Email sent",
      })
    } catch (err) {
      console.error("Email could not be sent", err)
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save({ validateBeforeSave: false })

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      })
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      })
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Verify email
// @route   GET /api/auth/verify-email/:verificationToken
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.verificationToken,
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      })
    }

    user.isVerified = true
    user.verificationToken = undefined

    await user.save({ validateBeforeSave: false })

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please provide a token",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from the token
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Send new token response
    sendTokenResponse(user, 200, res)
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      })
    }
    next(error)
  }
}

