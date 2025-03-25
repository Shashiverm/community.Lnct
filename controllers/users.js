import User from "../models/User.js"
import Post from "../models/Post.js"
import Notification from "../models/Notification.js"

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res, next) => {
  try {
    const { role, department, search, page = 1, limit = 10 } = req.query

    // Build query
    const query = {}

    if (role) {
      query.role = role
    }

    if (department) {
      query.department = department
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    // Check if user is updating their own profile or is an admin
    if (req.params.id !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      })
    }

    // Fields to update
    const fieldsToUpdate = {
      name: req.body.name,
      department: req.body.department,
      batch: req.body.batch,
      bio: req.body.bio,
      location: req.body.location,
      phone: req.body.phone,
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key])

    // Handle skills separately (convert from string to array)
    if (req.body.skills) {
      fieldsToUpdate.skills = req.body.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)
    }

    // Handle education, experience, projects, achievements arrays
    if (req.body.education) {
      fieldsToUpdate.education = req.body.education
    }

    if (req.body.experience) {
      fieldsToUpdate.experience = req.body.experience
    }

    if (req.body.projects) {
      fieldsToUpdate.projects = req.body.projects
    }

    if (req.body.achievements) {
      fieldsToUpdate.achievements = Array.isArray(req.body.achievements)
        ? req.body.achievements
        : req.body.achievements.split(",").map((a) => a.trim())
    }

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    await user.remove()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user connections
// @route   GET /api/users/:id/connections
// @access  Private
export const getUserConnections = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("connections", "name email role department batch profileImage")
      .populate("pendingConnections", "name email role department batch profileImage")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        connections: user.connections,
        pendingConnections: user.pendingConnections,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Connect with user
// @route   POST /api/users/:id/connect
// @access  Private
export const connectWithUser = async (req, res, next) => {
  try {
    // Check if trying to connect with self
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself",
      })
    }

    const targetUser = await User.findById(req.params.id)

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if already connected
    if (targetUser.connections.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Already connected with this user",
      })
    }

    // Check if connection request is already pending
    if (targetUser.pendingConnections.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Connection request already pending",
      })
    }

    // Add to pending connections
    targetUser.pendingConnections.push(req.user.id)
    await targetUser.save()

    // Create notification
    await Notification.create({
      recipient: targetUser._id,
      sender: req.user.id,
      type: "connection",
      content: `${req.user.name} sent you a connection request`,
      relatedId: req.user.id,
      onModel: "User",
    })

    res.status(200).json({
      success: true,
      message: "Connection request sent",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Accept connection request
// @route   PUT /api/users/connections/:id/accept
// @access  Private
export const acceptConnection = async (req, res, next) => {
  try {
    const requestingUser = await User.findById(req.params.id)

    if (!requestingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const currentUser = await User.findById(req.user.id)

    // Check if request exists
    if (!currentUser.pendingConnections.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "No pending connection request from this user",
      })
    }

    // Remove from pending and add to connections for both users
    currentUser.pendingConnections = currentUser.pendingConnections.filter((id) => id.toString() !== req.params.id)
    currentUser.connections.push(req.params.id)

    requestingUser.connections.push(req.user.id)

    await currentUser.save()
    await requestingUser.save()

    // Create notification
    await Notification.create({
      recipient: req.params.id,
      sender: req.user.id,
      type: "connection",
      content: `${currentUser.name} accepted your connection request`,
      relatedId: currentUser._id,
      onModel: "User",
    })

    res.status(200).json({
      success: true,
      message: "Connection request accepted",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Reject connection request
// @route   PUT /api/users/connections/:id/reject
// @access  Private
export const rejectConnection = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id)

    // Check if request exists
    if (!currentUser.pendingConnections.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "No pending connection request from this user",
      })
    }

    // Remove from pending connections
    currentUser.pendingConnections = currentUser.pendingConnections.filter((id) => id.toString() !== req.params.id)

    await currentUser.save()

    res.status(200).json({
      success: true,
      message: "Connection request rejected",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user posts
// @route   GET /api/users/:id/posts
// @access  Private
export const getUserPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const posts = await Post.find({ author: req.params.id, isDeleted: false })
      .populate("author", "name role profileImage")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Post.countDocuments({ author: req.params.id, isDeleted: false })

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
      data: posts,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update profile image
// @route   PUT /api/users/profile-image
// @access  Private
export const updateProfileImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image URL",
      })
    }

    const user = await User.findByIdAndUpdate(req.user.id, { profileImage: imageUrl }, { new: true })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (req, res, next) => {
  try {
    const { query, role, department, page = 1, limit = 10 } = req.query

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      })
    }

    // Build search query
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { skills: { $in: [new RegExp(query, "i")] } },
      ],
    }

    if (role) {
      searchQuery.role = role
    }

    if (department) {
      searchQuery.department = department
    }

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const users = await User.find(searchQuery)
      .select("name email role department batch profileImage skills")
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await User.countDocuments(searchQuery)

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

