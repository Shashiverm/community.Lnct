const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Course code is required"],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Course name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Course description is required"],
  },
  department: {
    type: String,
    required: [true, "Department is required"],
  },
  credits: {
    type: Number,
    required: [true, "Credits are required"],
  },
  faculty: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  syllabus: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  semester: {
    type: String,
    required: [true, "Semester is required"],
  },
  academicYear: {
    type: String,
    required: [true, "Academic year is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for better performance
CourseSchema.index({ code: 1 })
CourseSchema.index({ department: 1 })
CourseSchema.index({ semester: 1, academicYear: 1 })

module.exports = mongoose.model("Course", CourseSchema)
