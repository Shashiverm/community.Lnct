import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import morgan from "morgan"

// Import routes
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import eventRoutes from "./routes/events.js"
import resourceRoutes from "./routes/resources.js"
import messageRoutes from "./routes/messages.js"
import notificationRoutes from "./routes/notifications.js"

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js"
import { verifyToken } from "./middleware/auth.js"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser())
app.use(helmet())
app.use(morgan("dev"))
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", verifyToken, userRoutes)
app.use("/api/posts", verifyToken, postRoutes)
app.use("/api/events", verifyToken, eventRoutes)
app.use("/api/resources", verifyToken, resourceRoutes)
app.use("/api/messages", verifyToken, messageRoutes)
app.use("/api/notifications", verifyToken, notificationRoutes)

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  // Close server & exit process
  process.exit(1)
})

