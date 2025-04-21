const mongoose = require("mongoose")

const AnswerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true,
  },
  selectedOption: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
})

const QuizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    required: true,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  timeSpent: {
    type: Number, // Time spent in seconds
    required: true,
  },
  feedback: {
    type: String,
    default: "",
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema)
