import Resource from "../models/Resource.js"
import User from "../models/User.js"
import Notification from "../models/Notification.js"

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
export const getResources = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, type, author } = req.query

    // Build query
    const query = { isDeleted: false }

    if (category) {
      query.category = category
    }

    if (type) {
      query.type = type
    }

    if (author) {
      query.author = author
    }

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const resources = await Resource.find(query)
      .populate("author", "name role profileImage")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Resource.countDocuments(query)

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
      data: resources,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req, res, next) => {
  try {
    req.body.author = req.user.id

    const resource = await Resource.create(req.body)

    // Populate author details
    await resource.populate("author", "name role profileImage")

    res.status(201).json({
      success: true,
      data: resource,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Private
export const getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate("author", "name role profileImage")

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      })
    }

    // Check if user has access to this resource
    if (resource.visibility === "private" && resource.author._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      })
    }

    if (resource.visibility === "connections" && resource.author._id.toString() !== req.user.id) {
      // Check if user is connected with the author
      const user = await User.findById(req.user.id)
      if (!user.connections.includes(resource.author._id)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this resource",
        })
      }
    }

    res.status(200).json({
      success: true,
      data: resource,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
export const updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      })
    }

    // Make sure user is resource owner
    if (resource.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this resource",
      })
    }

    // Fields to update
    const fieldsToUpdate = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      url: req.body.url,
      tags: req.body.tags,
      visibility: req.body.visibility,
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key])

    resource = await Resource.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate("author", "name role profileImage")

    res.status(200).json({
      success: true,
      data: resource,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      })
    }

    // Make sure user is resource owner or admin
    if (resource.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this resource",
      })
    }

    // Soft delete
    resource.isDeleted = true
    await resource.save()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Like a resource
// @route   POST /api/resources/:id/like
// @access  Private
export const likeResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      })
    }

    // Check if resource has already been liked by user
    if (resource.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Resource already liked",
      })
    }

    // Add user id to likes array
    resource.likes.push(req.user.id)
    await resource.save()

    // Create notification if the user is not the author
    if (resource.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: resource.author,
        sender: req.user.id,
        type: "like",
        content: `${req.user.name} liked your resource`,
        relatedId: resource._id,
        onModel: "Resource",
      })
    }

    res.status(200).json({
      success: true,
      data: resource,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Unlike a resource
// @route   DELETE /api/resources/:id/like
// @access  Private
export const unlikeResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      })
    }

    // Check if resource has been liked by user
    if (!resource.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Resource has not been liked yet",
      })
    }

    // Remove user id from likes array
    resource.likes = resource.likes.filter((like) => like.toString() !== req.user.id)

    await resource.save()

    res.status(200).json({
      success: true,
      data: resource,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Download resource
// @route   GET /api/resources/:id/download
// @access  Private
export const downloadResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      })
    }

    // Check if user has access to this resource
    if (resource.visibility === "private" && resource.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      })
    }

    if (resource.visibility === "connections" && resource.author.toString() !== req.user.id) {
      // Check if user is connected with the author
      const user = await User.findById(req.user.id)
      if (!user.connections.includes(resource.author)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this resource",
        })
      }
    }

    // Increment download count
    resource.downloads += 1
    await resource.save()

    res.status(200).json({
      success: true,
      data: {
        url: resource.url,
        title: resource.title,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Search resources
// @route   GET /api/resources/search
// @access  Private
export const searchResources = async (req, res, next) => {
  try {
    const { query, category, type, page = 1, limit = 10 } = req.query

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      })
    }

    // Build search query
    const searchQuery = {
      isDeleted: false,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    }

    if (category) {
      searchQuery.category = category
    }

    if (type) {
      searchQuery.type = type
    }

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const resources = await Resource.find(searchQuery)
      .populate("author", "name role profileImage")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Resource.countDocuments(searchQuery)

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
      data: resources,
    })
  } catch (error) {
    next(error)
  }
}

