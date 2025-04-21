const mongoose = require("mongoose")

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Department name is required"],
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    required: [true, "Department code is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Department description is required"],
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  faculty: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  establishedYear: {
    type: Number,
  },
  contact: {
    email: String,
    phone: String,
    location: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for better performance
DepartmentSchema.index({ code: 1 })

module.exports = mongoose.model("Department", DepartmentSchema)
