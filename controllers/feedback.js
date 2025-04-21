const Feedback = require("../models/Feedback")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id

  const feedback = await Feedback.create(req.body)

  res.status(201).json({
    success: true,
    data: feedback,
  })
})

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (Admin only)
exports.getFeedback = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse("Only administrators can view all feedback", 403))
  }

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
  query = Feedback.find(JSON.parse(queryStr)).populate({
    path: "user",
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
  const total = await Feedback.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const feedback = await query

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
    count: feedback.length,
    pagination,
    data: feedback,
  })
})

// @desc    Get user's feedback
// @route   GET /api/feedback/me
// @access  Private
exports.getUserFeedback = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.find({ user: req.user.id }).sort("-createdAt")

  res.status(200).json({
    success: true,
    count: feedback.length,
    data: feedback,
  })
})

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
exports.getSingleFeedback = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findById(req.params.id).populate({
    path: "user",
    select: "name avatar role",
  })

  if (!feedback) {
    return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is feedback owner or admin
  if (feedback.user.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this feedback`, 401))
  }

  res.status(200).json({
    success: true,
    data: feedback,
  })
})

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
exports.updateFeedback = asyncHandler(async (req, res, next) => {
  let feedback = await Feedback.findById(req.params.id)

  if (!feedback) {
    return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is feedback owner
  if (feedback.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this feedback`, 401))
  }

  // Only allow updating if feedback is pending
  if (feedback.status !== "pending") {
    return next(new ErrorResponse("Cannot update feedback that has been reviewed or resolved", 400))
  }

  feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: feedback,
  })
})

// @desc    Respond to feedback
// @route   PUT /api/feedback/:id/respond
// @access  Private (Admin only)
exports.respondToFeedback = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findById(req.params.id)

  if (!feedback) {
    return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404))
  }

  // Check if user is admin or faculty
  if (req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse("Only administrators can respond to feedback", 403))
  }

  feedback.adminResponse = req.body.adminResponse
  feedback.status = req.body.status || "reviewed"
  feedback.updatedAt = Date.now()

  await feedback.save()

  res.status(200).json({
    success: true,
    data: feedback,
  })
})

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findById(req.params.id)

  if (!feedback) {
    return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is feedback owner or admin
  if (feedback.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this feedback`, 401))
  }

  await feedback.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
