const Department = require("../models/Department")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private (Admin only)
exports.createDepartment = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to create departments", 403))
  }

  const department = await Department.create(req.body)

  res.status(201).json({
    success: true,
    data: department,
  })
})

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
exports.getDepartments = asyncHandler(async (req, res, next) => {
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
  query = Department.find(JSON.parse(queryStr))

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
    query = query.sort("name")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Department.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Populate with head and faculty information
  query = query
    .populate({
      path: "head",
      select: "name email role",
    })
    .populate({
      path: "faculty",
      select: "name email role",
    })

  // Executing query
  const departments = await query

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
    count: departments.length,
    pagination,
    data: departments,
  })
})

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
exports.getDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id)
    .populate({
      path: "head",
      select: "name email role",
    })
    .populate({
      path: "faculty",
      select: "name email role",
    })
    .populate({
      path: "courses",
      select: "code name description credits semester academicYear",
    })

  if (!department) {
    return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: department,
  })
})

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin only)
exports.updateDepartment = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update departments", 403))
  }

  let department = await Department.findById(req.params.id)

  if (!department) {
    return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404))
  }

  department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: department,
  })
})

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to delete departments", 403))
  }

  const department = await Department.findById(req.params.id)

  if (!department) {
    return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404))
  }

  await department.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Add faculty to department
// @route   PUT /api/departments/:id/faculty/:userId
// @access  Private (Admin only)
exports.addFacultyToDepartment = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update departments", 403))
  }

  const department = await Department.findById(req.params.id)

  if (!department) {
    return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404))
  }

  // Check if faculty already exists in department
  if (department.faculty.includes(req.params.userId)) {
    return next(new ErrorResponse("Faculty already added to this department", 400))
  }

  department.faculty.push(req.params.userId)
  await department.save()

  res.status(200).json({
    success: true,
    data: department,
  })
})

// @desc    Remove faculty from department
// @route   DELETE /api/departments/:id/faculty/:userId
// @access  Private (Admin only)
exports.removeFacultyFromDepartment = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update departments", 403))
  }

  const department = await Department.findById(req.params.id)

  if (!department) {
    return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404))
  }

  // Check if faculty exists in department
  if (!department.faculty.includes(req.params.userId)) {
    return next(new ErrorResponse("Faculty not found in this department", 400))
  }

  department.faculty = department.faculty.filter((facultyId) => facultyId.toString() !== req.params.userId)
  await department.save()

  res.status(200).json({
    success: true,
    data: department,
  })
})
