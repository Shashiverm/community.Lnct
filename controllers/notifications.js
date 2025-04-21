import Notification from "../models/Notification.js"
import User from "../models/User.js"

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, read } = req.query

    // Build query
    const query = { recipient: req.user.id }

    if (read === "true") {
      query.read = true
    } else if (read === "false") {
      query.read = false
    }

    // Pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const notifications = await Notification.find(query)
      .populate("sender", "name role profileImage")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    })

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
      data: notifications,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Check if user is the recipient
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark this notification as read",
      })
    }

    // Mark as read
    notification.read = true
    notification.readAt = Date.now()
    await notification.save()

    res.status(200).json({
      success: true,
      data: notification,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true, readAt: Date.now() })

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Check if user is the recipient
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification",
      })
    }

    await notification.remove()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update notification settings
// @route   PUT /api/notifications/settings
// @access  Private
export const updateNotificationSettings = async (req, res, next) => {
  try {
    const { settings } = req.body

    if (!settings) {
      return res.status(400).json({
        success: false,
        message: "Please provide notification settings",
      })
    }

    // Update user's notification settings
    const user = await User.findByIdAndUpdate(req.user.id, { notificationSettings: settings }, { new: true })

    res.status(200).json({
      success: true,
      data: user.notificationSettings,
    })
  } catch (error) {
    next(error)
  }
}
