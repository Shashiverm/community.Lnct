import mongoose from "mongoose"

const connectDB = async () => {
  const maxRetries = 5
  let retries = 0
  let backoffTime = 1000 // Start with 1 second

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: process.env.NODE_ENV !== "production", // Don't build indexes in production
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      })

      console.log(`MongoDB Connected: ${conn.connection.host}`)

      // Set up connection error handlers
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err)
        // Don't exit process here, let the app handle reconnection
      })

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected, attempting to reconnect...")
        setTimeout(() => connectDB(), 5000) // Try to reconnect after 5 seconds
      })

      return conn
    } catch (error) {
      retries++
      console.error(`MongoDB connection attempt ${retries} failed:`, error.message)

      if (retries >= maxRetries) {
        console.error("Maximum MongoDB connection retries reached. Exiting...")
        process.exit(1)
      }

      // Wait with exponential backoff before retrying
      console.log(`Retrying in ${backoffTime / 1000} seconds...`)
      await new Promise((resolve) => setTimeout(resolve, backoffTime))
      backoffTime *= 2 // Exponential backoff
    }
  }
}

export default connectDB
