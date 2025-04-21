import Post from "../models/Post.js"
import User from "../models/User.js"
import Notification from "../models/Notification.js"

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, author, visibility } = req.query

    // Build query
    const query = { isDeleted: false }

    if (author) {
      query.author = author
    }

    // Handle visibility
    if (visibility) {
      query.visibility = visibility
    } else {
      // By default, show public posts and posts from connections
      const user = await User.findById(req.user.id)
      query.$or = [
        { visibility: "public" },
        {
          visibility: "connections",
          author: { $in: [...user.connections, req.user.id] },
        },
        {
          author: req.user.id,
        },
      ]
    }

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const posts = await Post.find(query)
      .populate("author", "name role profileImage")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Post.countDocuments(query)

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

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    req.body.author = req.user.id

    const post = await Post.create(req.body)

    // Populate author details
    await post.populate("author", "name role profileImage")

    res.status(201).json({
      success: true,
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name role profileImage")
      .populate("comments.user", "name role profileImage")

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Check if user has access to this post
    if (post.visibility === "private" && post.author._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this post",
      })
    }

    if (post.visibility === "connections" && post.author._id.toString() !== req.user.id) {
      // Check if user is connected with the author
      const user = await User.findById(req.user.id)
      if (!user.connections.includes(post.author._id)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this post",
        })
      }
    }

    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      })
    }

    // Fields to update
    const fieldsToUpdate = {
      content: req.body.content,
      visibility: req.body.visibility,
      tags: req.body.tags,
      media: req.body.media,
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key])

    post = await Post.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate("author", "name role profileImage")

    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      })
    }

    // Soft delete
    post.isDeleted = true
    await post.save()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Check if post has already been liked by user
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      })
    }

    // Add user id to likes array
    post.likes.push(req.user.id)
    await post.save()

    // Create notification if the user is not the author
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: "like",
        content: `${req.user.name} liked your post`,
        relatedId: post._id,
        onModel: "Post",
      })
    }

    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Check if post has been liked by user
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Post has not been liked yet",
      })
    }

    // Remove user id from likes array
    post.likes = post.likes.filter((like) => like.toString() !== req.user.id)

    await post.save()

    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Please provide comment text",
      })
    }

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Add comment
    const comment = {
      user: req.user.id,
      text,
      createdAt: Date.now(),
    }

    post.comments.push(comment)
    await post.save()

    // Populate user details in the new comment
    await post.populate("comments.user", "name role profileImage")

    // Create notification if the user is not the author
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: "comment",
        content: `${req.user.name} commented on your post`,
        relatedId: post._id,
        onModel: "Post",
      })
    }

    res.status(200).json({
      success: true,
      data: post.comments[post.comments.length - 1],
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Find comment
    const comment = post.comments.find((comment) => comment._id.toString() === req.params.commentId)

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      })
    }

    // Check if user is comment owner or post owner or admin
    if (
      comment.user.toString() !== req.user.id &&
      post.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      })
    }

    // Remove comment
    post.comments = post.comments.filter((comment) => comment._id.toString() !== req.params.commentId)

    await post.save()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get post comments
// @route   GET /api/posts/:id/comments
// @access  Private
export const getPostComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments.user", "name role profileImage")

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    res.status(200).json({
      success: true,
      count: post.comments.length,
      data: post.comments,
    })
  } catch (error) {
    next(error)
  }
}
