const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  options: {
    type: [String],
    required: [true, "Options are required"],
    validate: {
      validator: (v) => {
        return v.length >= 2 // At least 2 options required
      },
      message: "Quiz must have at least 2 options",
    },
  },
  correctAnswer: {
    type: Number, // Index of the correct option
    required: [true, "Correct answer is required"],
  },
  points: {
    type: Number,
    default: 1,
  },
})

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Quiz title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Quiz description is required"],
  },
  course: {
    type: String,
    required: [true, "Course is required"],
  },
  questions: {
    type: [QuestionSchema],
    required: [true, "Questions are required"],
    validate: {
      validator: (v) => v.length > 0,
      message: "Quiz must have at least one question",
    },
  },
  timeLimit: {
    type: Number, // Time limit in minutes
    default: 30,
  },
  passingScore: {
    type: Number, // Percentage required to pass
    default: 60,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  availableFrom: {
    type: Date,
    default: Date.now,
  },
  availableTo: {
    type: Date,
    default: () => {
      // Default to 7 days from creation
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Quiz", QuizSchema)
