const Course = require("../models/Course")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin/Faculty only)
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Check if user is admin or faculty
  if (req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse("Not authorized to create courses", 403))
  }

  const course = await Course.create(req.body)

  res.status(201).json({
    success: true,
    data: course,
  })
})

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
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
  query = Course.find(JSON.parse(queryStr))

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
  const total = await Course.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Populate with faculty information
  query = query.populate({
    path: "faculty",
    select: "name email role",
  })

  // Executing query
  const courses = await query

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
    count: courses.length,
    pagination,
    data: courses,
  })
})

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate({
      path: "faculty",
      select: "name email role",
    })
    .populate({
      path: "students",
      select: "name email role",
    })

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin/Faculty only)
exports.updateCourse = asyncHandler(async (req, res, next) => {
  // Check if user is admin or faculty
  if (req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse("Not authorized to update courses", 403))
  }

  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to delete courses", 403))
  }

  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
  }

  await course.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
  }

  // Check if user is already enrolled
  if (course.students.includes(req.user.id)) {
    return next(new ErrorResponse("Already enrolled in this course", 400))
  }

  course.students.push(req.user.id)
  await course.save()

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc    Unenroll from a course
// @route   DELETE /api/courses/:id/enroll
// @access  Private
exports.unenrollCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
  }

  // Check if user is enrolled
  if (!course.students.includes(req.user.id)) {
    return next(new ErrorResponse("Not enrolled in this course", 400))
  }

  course.students = course.students.filter((studentId) => studentId.toString() !== req.user.id)
  await course.save()

  res.status(200).json({
    success: true,
    data: course,
  })
})
