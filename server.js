const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
const cookieParser = require("cookie-parser")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const cors = require("cors")
const errorHandler = require("./middleware/errorHandler")
const connectDB = require("./config/db")

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Route files
const auth = require("./routes/auth")
const users = require("./routes/users")
const posts = require("./routes/posts")
const events = require("./routes/events")
const resources = require("./routes/resources")
const messages = require("./routes/messages")
const notifications = require("./routes/notifications")
const quizzes = require("./routes/quizzes")
const assignments = require("./routes/assignments")
const feedback = require("./routes/feedback")
const courses = require("./routes/courses")
const departments = require("./routes/departments")
const announcements = require("./routes/announcements")
const academicCalendar = require("./routes/academicCalendar")
const supportTickets = require("./routes/supportTickets")

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Mount routers
app.use("/api/auth", auth)
app.use("/api/users", users)
app.use("/api/posts", posts)
app.use("/api/events", events)
app.use("/api/resources", resources)
app.use("/api/messages", messages)
app.use("/api/notifications", notifications)
app.use("/api/quizzes", quizzes)
app.use("/api/assignments", assignments)
app.use("/api/feedback", feedback)
app.use("/api/courses", courses)
app.use("/api/departments", departments)
app.use("/api/announcements", announcements)
app.use("/api/academic-calendar", academicCalendar)
app.use("/api/support-tickets", supportTickets)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold),
)

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})
