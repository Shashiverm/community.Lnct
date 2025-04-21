const mongoose = require("mongoose")

const CalendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  category: {
    type: String,
    enum: ["holiday", "exam", "admission", "result", "event", "other"],
    default: "other",
  },
  isAllDay: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

const AcademicCalendarSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: [true, "Academic year is required"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Calendar title is required"],
    trim: true,
  },
  description: {
    type: String,
  },
  events: [CalendarEventSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for better performance
AcademicCalendarSchema.index({ academicYear: 1 })
AcademicCalendarSchema.index({ "events.startDate": 1 })
AcademicCalendarSchema.index({ "events.category": 1 })

module.exports = mongoose.model("AcademicCalendar", AcademicCalendarSchema)
