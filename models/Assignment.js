const mongoose = require("mongoose")

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Assignment title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Assignment description is required"],
  },
  course: {
    type: String,
    required: [true, "Course is required"],
  },
  creator: {
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
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  totalPoints: {
    type: Number,
    required: [true, "Total points are required"],
    default: 100,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Assignment", AssignmentSchema)
