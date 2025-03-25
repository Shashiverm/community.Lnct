import Message from "../models/Message.js"
import Conversation from "../models/Conversation.js"
import User from "../models/User.js"
import Notification from "../models/Notification.js"

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: req.user.id,
      isDeleted: false,
    })
      .populate("participants", "name role profileImage")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })

    // Format conversations for response
    const formattedConversations = conversations.map((conversation) => {
      // Get the other participant (for 1-on-1 conversations)
      const otherParticipant = conversation.participants.find((p) => p._id.toString() !== req.user.id)

      // Count unread messages
      const unreadCount =
        conversation.lastMessage &&
        !conversation.lastMessage.read &&
        conversation.lastMessage.sender.toString() !== req.user.id
          ? 1
          : 0

      return {
        id: conversation._id,
        recipient: otherParticipant || null,
        isGroup: conversation.isGroup,
        groupName: conversation.groupName,
        lastMessage: conversation.lastMessage
          ? {
              text: conversation.lastMessage.text,
              timestamp: conversation.lastMessage.createdAt,
              read: conversation.lastMessage.read,
              sender: conversation.lastMessage.sender.toString() === req.user.id ? "user" : "recipient",
            }
          : null,
        unreadCount,
      }
    })

    res.status(200).json({
      success: true,
      count: formattedConversations.length,
      data: formattedConversations,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversations/:id
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      })
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this conversation",
      })
    }

    // Get messages
    const messages = await Message.find({
      conversation: req.params.id,
      isDeleted: false,
    }).sort({ createdAt: 1 })

    // Format messages for response
    const formattedMessages = messages.map((message) => ({
      id: message._id,
      text: message.text,
      timestamp: message.createdAt,
      sender: message.sender.toString() === req.user.id ? "user" : "recipient",
      read: message.read,
      attachments: message.attachments,
    }))

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversation: req.params.id,
        recipient: req.user.id,
        read: false,
      },
      {
        read: true,
        readAt: Date.now(),
      },
    )

    res.status(200).json({
      success: true,
      count: formattedMessages.length,
      data: formattedMessages,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { recipient, text, conversationId, attachments } = req.body

    if (!text && (!attachments || attachments.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide message text or attachments",
      })
    }

    let conversation

    // If conversationId is provided, use existing conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId)

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        })
      }

      // Check if user is a participant
      if (!conversation.participants.includes(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this conversation",
        })
      }
    }
    // Otherwise, create a new conversation or find existing one
    else if (recipient) {
      // Check if recipient exists
      const recipientUser = await User.findById(recipient)

      if (!recipientUser) {
        return res.status(404).json({
          success: false,
          message: "Recipient not found",
        })
      }

      // Check if conversation already exists
      conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [req.user.id, recipient] },
      })

      // If not, create new conversation
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user.id, recipient],
          isGroup: false,
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide either conversationId or recipient",
      })
    }

    // Create message
    const message = await Message.create({
      sender: req.user.id,
      recipient: conversation.participants.find((p) => p.toString() !== req.user.id),
      conversation: conversation._id,
      text,
      attachments,
    })

    // Update conversation's lastMessage
    conversation.lastMessage = message._id
    await conversation.save()

    // Create notification for recipient
    const recipientId = conversation.participants.find((p) => p.toString() !== req.user.id)

    await Notification.create({
      recipient: recipientId,
      sender: req.user.id,
      type: "message",
      content: `${req.user.name} sent you a message`,
      relatedId: conversation._id,
      onModel: "Conversation",
    })

    res.status(201).json({
      success: true,
      data: {
        id: message._id,
        text: message.text,
        timestamp: message.createdAt,
        sender: "user",
        read: false,
        attachments: message.attachments,
        conversationId: conversation._id,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark this message as read",
      })
    }

    // Mark as read
    message.read = true
    message.readAt = Date.now()
    await message.save()

    res.status(200).json({
      success: true,
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a new conversation
// @route   POST /api/messages/conversations
// @access  Private
export const createConversation = async (req, res, next) => {
  try {
    const { participants, isGroup, groupName } = req.body

    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide participants",
      })
    }

    // Add current user to participants if not already included
    if (!participants.includes(req.user.id)) {
      participants.push(req.user.id)
    }

    // For group conversations, validate group name
    if (isGroup && !groupName) {
      return res.status(400).json({
        success: false,
        message: "Please provide a group name",
      })
    }

    // Check if non-group conversation already exists
    if (!isGroup && participants.length === 2) {
      const existingConversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: participants },
      })

      if (existingConversation) {
        return res.status(200).json({
          success: true,
          data: existingConversation,
        })
      }
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants,
      isGroup: isGroup || false,
      groupName,
      groupAdmin: isGroup ? req.user.id : undefined,
    })

    // Populate participants
    await conversation.populate("participants", "name role profileImage")

    res.status(201).json({
      success: true,
      data: conversation,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message",
      })
    }

    // Soft delete
    message.isDeleted = true
    await message.save()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a conversation
// @route   DELETE /api/messages/conversations/:id
// @access  Private
export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      })
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this conversation",
      })
    }

    // For group conversations, only admin can delete
    if (conversation.isGroup && conversation.groupAdmin.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only group admin can delete this conversation",
      })
    }

    // Soft delete
    conversation.isDeleted = true
    await conversation.save()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

