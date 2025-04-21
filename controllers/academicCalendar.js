const AcademicCalendar = require("../models/AcademicCalendar")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create a new academic calendar
// @route   POST /api/academic-calendar
// @access  Private (Admin only)
exports.createCalendar = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to create academic calendars", 403))
  }

  // Add user to req.body
  req.body.createdBy = req.user.id

  const calendar = await AcademicCalendar.create(req.body)

  res.status(201).json({
    success: true,
    data: calendar,
  })
})

// @desc    Get all academic calendars
// @route   GET /api/academic-calendar
// @access  Public
exports.getCalendars = asyncHandler(async (req, res, next) => {
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
  query = AcademicCalendar.find(JSON.parse(queryStr))

  // Only show active calendars
  if (!reqQuery.isActive) {
    query = query.find({ isActive: true })
  }

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
    query = query.sort("-academicYear")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await AcademicCalendar.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Populate with creator information
  query = query.populate({
    path: "createdBy",
    select: "name role",
  })

  // Executing query
  const calendars = await query

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
    count: calendars.length,
    pagination,
    data: calendars,
  })
})

// @desc    Get single academic calendar
// @route   GET /api/academic-calendar/:id
// @access  Public
exports.getCalendar = asyncHandler(async (req, res, next) => {
  const calendar = await AcademicCalendar.findById(req.params.id)
    .populate({
      path: "createdBy",
      select: "name role",
    })
    .populate({
      path: "events.createdBy",
      select: "name role",
    })
    .populate({
      path: "events.departments",
      select: "name code",
    })
    .populate({
      path: "events.courses",
      select: "code name",
    })

  if (!calendar) {
    return next(new ErrorResponse(`Academic calendar not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: calendar,
  })
})

// @desc    Update academic calendar
// @route   PUT /api/academic-calendar/:id
// @access  Private (Admin only)
exports.updateCalendar = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update academic calendars", 403))
  }

  let calendar = await AcademicCalendar.findById(req.params.id)

  if (!calendar) {
    return next(new ErrorResponse(`Academic calendar not found with id of ${req.params.id}`, 404))
  }

  calendar = await AcademicCalendar.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: calendar,
  })
})

// @desc    Delete academic calendar
// @route   DELETE /api/academic-calendar/:id
// @access  Private (Admin only)
exports.deleteCalendar = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to delete academic calendars", 403))
  }

  const calendar = await AcademicCalendar.findById(req.params.id)

  if (!calendar) {
    return next(new ErrorResponse(`Academic calendar not found with id of ${req.params.id}`, 404))
  }

  await calendar.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Add event to academic calendar
// @route   POST /api/academic-calendar/:id/events
// @access  Private (Admin/Faculty only)
exports.addEvent = asyncHandler(async (req, res, next) => {
  // Check if user is admin or faculty
  if (req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse("Not authorized to add events to academic calendars", 403))
  }

  const calendar = await AcademicCalendar.findById(req.params.id)

  if (!calendar) {
    return next(new ErrorResponse(`Academic calendar not found with id of ${req.params.id}`, 404))
  }

  // Add user to req.body
  req.body.createdBy = req.user.id

  calendar.events.push(req.body)
  await calendar.save()

  res.status(200).json({
    success: true,
    data: calendar,
  })
})

// @desc    Update event in academic calendar
// @route   PUT /api/academic-calendar/:id/events/:eventId
// @access  Private (Admin/Faculty only)
exports.updateEvent = asyncHandler(async (req, res, next) => {
  // Check if user is admin or faculty
  if (req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse("Not authorized to update events in academic calendars", 403))
  }

  const calendar = await AcademicCalendar.findById(req.params.id)

  if (!calendar) {
    return next(new ErrorResponse(`Academic calendar not found with id of ${req.params.id}`, 404))
  }

  const event = calendar.events.id(req.params.eventId)

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.eventId}`, 404))
  }

  // Make sure user is event creator or admin
  if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this event`, 401))
  }

  // Update event fields
  Object.keys(req.body).forEach((key) => {
    event[key] = req.body[key]
  })

  await calendar.save()

  res.status(200).json({
    success: true,
    data: calendar,
  })
})

// @desc    Delete event from academic calendar
// @route   DELETE /api/academic-calendar/:id/events/:eventId
// @access  Private (Admin/Faculty only)
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  // Check if user is admin or faculty
  if (req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse("Not authorized to delete events from academic calendars", 403))
  }

  const calendar = await AcademicCalendar.findById(req.params.id)

  if (!calendar) {
    return next(new ErrorResponse(`Academic calendar not found with id of ${req.params.id}`, 404))
  }

  const event = calendar.events.id(req.params.eventId)

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.eventId}`, 404))
  }

  // Make sure user is event creator or admin
  if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this event`, 401))
  }

  event.remove()
  await calendar.save()

  res.status(200).json({
    success: true,
    data: calendar,
  })
})
