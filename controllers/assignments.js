const Assignment = require("../models/Assignment")
const AssignmentSubmission = require("../models/AssignmentSubmission")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private (Faculty only)
exports.createAssignment = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.creator = req.user.id

  // Check if user is faculty
  if (req.user.role !== "faculty") {
    return next(new ErrorResponse("Only faculty members can create assignments", 403))
  }

  const assignment = await Assignment.create(req.body)

  res.status(201).json({
    success: true,
    data: assignment,
  })
})

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = asyncHandler(async (req, res, next) => {
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
  query = Assignment.find(JSON.parse(queryStr)).populate({
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
  const total = await Assignment.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const assignments = await query

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
    count: assignments.length,
    pagination,
    data: assignments,
  })
})

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id).populate({
    path: "creator",
    select: "name avatar role",
  })

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: assignment,
  })
})

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Faculty only)
exports.updateAssignment = asyncHandler(async (req, res, next) => {
  let assignment = await Assignment.findById(req.params.id)

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is assignment creator or admin
  if (assignment.creator.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this assignment`, 401))
  }

  // Check if user is faculty
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    return next(new ErrorResponse("Only faculty members can update assignments", 403))
  }

  assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: assignment,
  })
})

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Faculty only)
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is assignment creator or admin
  if (assignment.creator.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this assignment`, 401))
  }

  // Check if user is faculty
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    return next(new ErrorResponse("Only faculty members can delete assignments", 403))
  }

  await assignment.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private
exports.submitAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404))
  }

  // Check if assignment is past due date
  const now = new Date()
  let status = "submitted"

  if (now > assignment.dueDate) {
    status = "late"
  }

  // Check if user has already submitted this assignment
  const existingSubmission = await AssignmentSubmission.findOne({
    assignment: req.params.id,
    user: req.user.id,
  })

  if (existingSubmission) {
    // Update existing submission
    existingSubmission.attachments = req.body.attachments
    existingSubmission.comment = req.body.comment
    existingSubmission.status = "resubmitted"
    existingSubmission.submittedAt = now

    await existingSubmission.save()

    return res.status(200).json({
      success: true,
      data: existingSubmission,
    })
  }

  // Create submission
  const submission = await AssignmentSubmission.create({
    assignment: req.params.id,
    user: req.user.id,
    attachments: req.body.attachments,
    comment: req.body.comment,
    status,
  })

  res.status(201).json({
    success: true,
    data: submission,
  })
})

// @desc    Get assignment submissions
// @route   GET /api/assignments/:id/submissions
// @access  Private (Faculty only)
exports.getAssignmentSubmissions = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404))
  }

  // Check if user is faculty or admin
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    return next(new ErrorResponse("Only faculty members can view all submissions", 403))
  }

  const submissions = await AssignmentSubmission.find({ assignment: req.params.id })
    .populate({
      path: "user",
      select: "name avatar role",
    })
    .sort("-submittedAt")

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions,
  })
})

// @desc    Get user's assignment submissions
// @route   GET /api/assignments/submissions
// @access  Private
exports.getUserSubmissions = asyncHandler(async (req, res, next) => {
  const submissions = await AssignmentSubmission.find({ user: req.user.id })
    .populate({
      path: "assignment",
      select: "title description course dueDate totalPoints",
    })
    .sort("-submittedAt")

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions,
  })
})

// @desc    Grade assignment submission
// @route   PUT /api/assignments/submissions/:id
// @access  Private (Faculty only)
exports.gradeSubmission = asyncHandler(async (req, res, next) => {
  const submission = await AssignmentSubmission.findById(req.params.id).populate("assignment")

  if (!submission) {
    return next(new ErrorResponse(`Submission not found with id of ${req.params.id}`, 404))
  }

  // Check if user is faculty or admin
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    return next(new ErrorResponse("Only faculty members can grade submissions", 403))
  }

  // Validate score
  if (req.body.score > submission.assignment.totalPoints) {
    return next(new ErrorResponse(`Score cannot exceed total points (${submission.assignment.totalPoints})`, 400))
  }

  submission.score = req.body.score
  submission.feedback = req.body.feedback
  submission.status = "graded"
  submission.gradedAt = new Date()

  await submission.save()

  res.status(200).json({
    success: true,
    data: submission,
  })
})
