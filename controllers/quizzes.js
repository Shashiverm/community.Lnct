const Quiz = require("../models/Quiz")
const QuizAttempt = require("../models/QuizAttempt")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Faculty only)
exports.createQuiz = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.creator = req.user.id

  // Check if user is faculty
  if (req.user.role !== "faculty") {
    return next(new ErrorResponse("Only faculty members can create quizzes", 403))
  }

  const quiz = await Quiz.create(req.body)

  res.status(201).json({
    success: true,
    data: quiz,
  })
})

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
exports.getQuizzes = asyncHandler(async (req, res, next) => {
  let query

  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  query = Quiz.find(JSON.parse(queryStr)).populate({
    path: "creator",
    select: "name avatar role",
  })

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Quiz.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const quizzes = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: quizzes.length,
    pagination,
    data: quizzes,
  })
})

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate({
    path: "creator",
    select: "name avatar role",
  })

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: quiz,
  })
})

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Faculty only)
exports.updateQuiz = asyncHandler(async (req, res, next) => {
  let quiz = await Quiz.findById(req.params.id)

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is quiz creator or admin
  if (quiz.creator.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this quiz`, 401))
  }

  // Check if user is faculty
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    return next(new ErrorResponse("Only faculty members can update quizzes", 403))
  }

  quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: quiz,
  })
})

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Faculty only)
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id)

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is quiz creator or admin
  if (quiz.creator.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this quiz`, 401))
  }

  // Check if user is faculty
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    return next(new ErrorResponse("Only faculty members can delete quizzes", 403))
  }

  await quiz.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Private
exports.submitQuizAttempt = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id)

  if (!quiz) {
    return next(new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404))
  }

  // Check if quiz is available
  const now = new Date()
  if (now < quiz.availableFrom || now > quiz.availableTo) {
    return next(new ErrorResponse("This quiz is not currently available", 400))
  }

  // Check if user has already attempted this quiz
  const existingAttempt = await QuizAttempt.findOne({
    quiz: req.params.id,
    user: req.user.id,
  })

  if (existingAttempt) {
    return next(new ErrorResponse("You have already attempted this quiz", 400))
  }

  // Calculate score
  let score = 0
  let totalPoints = 0

  const answers = req.body.answers.map((answer) => {
    const question = quiz.questions[answer.questionIndex]
    totalPoints += question.points

    const isCorrect = answer.selectedOption === question.correctAnswer
    if (isCorrect) {
      score += question.points
    }

    return {
      questionIndex: answer.questionIndex,
      selectedOption: answer.selectedOption,
      isCorrect,
    }
  })

  const percentage = (score / totalPoints) * 100
  const passed = percentage >= quiz.passingScore

  // Create attempt
  const attempt = await QuizAttempt.create({
    quiz: req.params.id,
    user: req.user.id,
    answers,
    score,
    totalPoints,
    percentage,
    passed,
    timeSpent: req.body.timeSpent,
    completedAt: new Date(),
  })

  res.status(201).json({
    success: true,
    data: attempt,
  })
})

// @desc    Get quiz attempts for a user
// @route   GET /api/quizzes/attempts
// @access  Private
exports.getQuizAttempts = asyncHandler(async (req, res, next) => {
  const attempts = await QuizAttempt.find({ user: req.user.id })
    .populate({
      path: "quiz",
      select: "title description course",
    })
    .sort("-completedAt")

  res.status(200).json({
    success: true,
    count: attempts.length,
    data: attempts,
  })
})

// @desc    Get quiz attempt
// @route   GET /api/quizzes/attempts/:id
// @access  Private
exports.getQuizAttempt = asyncHandler(async (req, res, next) => {
  const attempt = await QuizAttempt.findById(req.params.id).populate({
    path: "quiz",
    select: "title description course questions",
  })

  if (!attempt) {
    return next(new ErrorResponse(`Quiz attempt not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is attempt owner or faculty
  if (attempt.user.toString() !== req.user.id && req.user.role !== "faculty" && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this attempt`, 401))
  }

  res.status(200).json({
    success: true,
    data: attempt,
  })
})

// @desc    Add feedback to quiz attempt
// @route   PUT /api/quizzes/attempts/:id/feedback
// @access  Private (Faculty only)
exports.addQuizFeedback = asyncHandler(async (req, res, next) => {
  const attempt = await QuizAttempt.findById(req.params.id)

  if (!attempt) {
    return next(new ErrorResponse(`Quiz attempt not found with id of ${req.params.id}`, 404))
  }

  // Check if user is faculty
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    return next(new ErrorResponse("Only faculty members can add feedback", 403))
  }

  attempt.feedback = req.body.feedback
  await attempt.save()

  res.status(200).json({
    success: true,
    data: attempt,
  })
})
