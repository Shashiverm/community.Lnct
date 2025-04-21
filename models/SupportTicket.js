const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment content is required"],
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const SupportTicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Ticket title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Ticket description is required"],
  },
  category: {
    type: String,
    enum: ["technical", "academic", "administrative", "other"],
    default: "other",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved", "closed"],
    default: "open",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  attachments: [
    {
      filename: String,
      path: String,
      mimetype: String,
    },
  ],
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
})

// Create indexes for better performance
SupportTicketSchema.index({ status: 1 })
SupportTicketSchema.index({ priority: 1 })
SupportTicketSchema.index({ category: 1 })
SupportTicketSchema.index({ creator: 1 })
SupportTicketSchema.index({ assignedTo: 1 })
SupportTicketSchema.index({ createdAt: -1 })

module.exports = mongoose.model("SupportTicket", SupportTicketSchema)
