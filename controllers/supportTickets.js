const SupportTicket = require("../models/SupportTicket")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create a new support ticket
// @route   POST /api/support-tickets
// @access  Private
exports.createTicket = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.creator = req.user.id

  const ticket = await SupportTicket.create(req.body)

  res.status(201).json({
    success: true,
    data: ticket,
  })
})

// @desc    Get all support tickets
// @route   GET /api/support-tickets
// @access  Private (Admin/Staff only)
exports.getTickets = asyncHandler(async (req, res, next) => {
  // Check if user is admin or staff
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return next(new ErrorResponse("Not authorized to view all support tickets", 403))
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
  query = SupportTicket.find(JSON.parse(queryStr))

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
  const total = await SupportTicket.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Populate with user information
  query = query
    .populate({
      path: "creator",
      select: "name email role",
    })
    .populate({
      path: "assignedTo",
      select: "name email role",
    })

  // Executing query
  const tickets = await query

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
    count: tickets.length,
    pagination,
    data: tickets,
  })
})

// @desc    Get user's support tickets
// @route   GET /api/support-tickets/me
// @access  Private
exports.getUserTickets = asyncHandler(async (req, res, next) => {
  const tickets = await SupportTicket.find({ creator: req.user.id })
    .populate({
      path: "assignedTo",
      select: "name email role",
    })
    .sort("-createdAt")

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets,
  })
})

// @desc    Get single support ticket
// @route   GET /api/support-tickets/:id
// @access  Private
exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate({
      path: "creator",
      select: "name email role",
    })
    .populate({
      path: "assignedTo",
      select: "name email role",
    })
    .populate({
      path: "comments.author",
      select: "name email role",
    })

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is ticket creator, assigned staff, or admin
  if (
    ticket.creator.toString() !== req.user.id &&
    (!ticket.assignedTo || ticket.assignedTo.toString() !== req.user.id) &&
    req.user.role !== "admin" &&
    req.user.role !== "staff"
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this ticket`, 401))
  }

  res.status(200).json({
    success: true,
    data: ticket,
  })
})

// @desc    Update support ticket
// @route   PUT /api/support-tickets/:id
// @access  Private
exports.updateTicket = asyncHandler(async (req, res, next) => {
  let ticket = await SupportTicket.findById(req.params.id)

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is ticket creator, assigned staff, or admin
  if (
    ticket.creator.toString() !== req.user.id &&
    (!ticket.assignedTo || ticket.assignedTo.toString() !== req.user.id) &&
    req.user.role !== "admin" &&
    req.user.role !== "staff"
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this ticket`, 401))
  }

  // If user is not admin or staff, they can only update certain fields
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    const allowedFields = ["title", "description", "category", "priority", "attachments"]
    const requestedFields = Object.keys(req.body)

    const invalidFields = requestedFields.filter((field) => !allowedFields.includes(field))

    if (invalidFields.length > 0) {
      return next(new ErrorResponse(`Not authorized to update fields: ${invalidFields.join(", ")}`, 403))
    }
  }

  // Update updatedAt field
  req.body.updatedAt = Date.now()

  ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: ticket,
  })
})

// @desc    Delete support ticket
// @route   DELETE /api/support-tickets/:id
// @access  Private
exports.deleteTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id)

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is ticket creator or admin
  if (ticket.creator.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this ticket`, 401))
  }

  await ticket.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Assign support ticket
// @route   PUT /api/support-tickets/:id/assign
// @access  Private (Admin/Staff only)
exports.assignTicket = asyncHandler(async (req, res, next) => {
  // Check if user is admin or staff
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return next(new ErrorResponse("Not authorized to assign support tickets", 403))
  }

  let ticket = await SupportTicket.findById(req.params.id)

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404))
  }

  ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    {
      assignedTo: req.body.assignedTo,
      status: "in-progress",
      updatedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  )

  res.status(200).json({
    success: true,
    data: ticket,
  })
})

// @desc    Add comment to support ticket
// @route   POST /api/support-tickets/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id)

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is ticket creator, assigned staff, or admin
  if (
    ticket.creator.toString() !== req.user.id &&
    (!ticket.assignedTo || ticket.assignedTo.toString() !== req.user.id) &&
    req.user.role !== "admin" &&
    req.user.role !== "staff"
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to comment on this ticket`, 401))
  }

  // Add user to req.body
  req.body.author = req.user.id

  ticket.comments.push(req.body)
  ticket.updatedAt = Date.now()
  await ticket.save()

  res.status(200).json({
    success: true,
    data: ticket,
  })
})

// @desc    Resolve support ticket
// @route   PUT /api/support-tickets/:id/resolve
// @access  Private (Admin/Staff only)
exports.resolveTicket = asyncHandler(async (req, res, next) => {
  // Check if user is admin or staff
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return next(new ErrorResponse("Not authorized to resolve support tickets", 403))
  }

  let ticket = await SupportTicket.findById(req.params.id)

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404))
  }

  ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    {
      status: "resolved",
      resolvedAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  )

  res.status(200).json({
    success: true,
    data: ticket,
  })
})
