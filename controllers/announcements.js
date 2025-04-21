const Announcement = require("../models/Announcement")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private (Admin/Faculty only)
exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  // Check if user is admin or faculty
  if (req.user.role !== "admin" && req.user.role !== "faculty") {
    return next(new ErrorResponse("Not authorized to create announcements", 403))
  }

  // Add user to req.body
  req.body.author = req.user.id

  const announcement = await Announcement.create(req.body)

  res.status(201).json({
    success: true,
    data: announcement,
  })
})

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = asyncHandler(async (req, res, next) => {
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
  query = Announcement.find(JSON.parse(queryStr))

  // Only show active announcements
  if (!reqQuery.isActive) {
    query = query.find({ isActive: true })
  }

  // Only show announcements that haven't expired
  if (!reqQuery.includeExpired) {
    query = query.find({
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: null }, { expiryDate: { $gt: new Date() } }],
    })
  }

  // Filter by target audience
  if (req.user && req.user.role) {
    query = query.find({
      $or: [{ targetAudience: "all" }, { targetAudience: req.user.role }],
    })
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
    query = query.sort("-publishDate")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Announcement.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Populate with author information
  query = query
    .populate({
      path: "author",
      select: "name role",
    })
    .populate({
      path: "departments",
      select: "name code",
    })
    .populate({
      path: "courses",
      select: "code name",
    })

  // Executing query
  const announcements = await query

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
    count: announcements.length,
    pagination,
    data: announcements,
  })
})

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id)
    .populate({
      path: "author",
      select: "name role",
    })
    .populate({
      path: "departments",
      select: "name code",
    })
    .populate({
      path: "courses",
      select: "code name",
    })

  if (!announcement) {
    return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: announcement,
  })
})

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin/Faculty only)
exports.updateAnnouncement = asyncHandler(async (req, res, next) => {
  let announcement = await Announcement.findById(req.params.id)

  if (!announcement) {
    return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is announcement author or admin
  if (announcement.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this announcement`, 401))
  }

  announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: announcement,
  })
})

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin/Faculty only)
exports.deleteAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id)

  if (!announcement) {
    return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is announcement author or admin
  if (announcement.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this announcement`, 401))
  }

  await announcement.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
