import express from "express"
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
} from "../controllers/auth.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/me", verifyToken, getMe)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:resetToken", resetPassword)
router.get("/verify-email/:verificationToken", verifyEmail)
router.post("/refresh-token", refreshToken)

export default router

