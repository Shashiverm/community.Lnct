const mongoose = require("mongoose")

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Announcement title is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Announcement content is required"],
  },
  category: {
    type: String,
    enum: ["general", "academic", "event", "emergency", "other"],
    default: "general",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  targetAudience: {
    type: [String],
    enum: ["all", "students", "faculty", "staff", "admin"],
    default: ["all"],
  },
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachments: [
    {
      filename: String,
      path: String,
      mimetype: String,
    },
  ],
  publishDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for better performance
AnnouncementSchema.index({ publishDate: -1 })
AnnouncementSchema.index({ category: 1 })
AnnouncementSchema.index({ priority: 1 })
AnnouncementSchema.index({ targetAudience: 1 })
AnnouncementSchema.index({ departments: 1 })
AnnouncementSchema.index({ courses: 1 })

module.exports = mongoose.model("Announcement", AnnouncementSchema)
