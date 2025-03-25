import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Please provide a message"],
      maxlength: [5000, "Message cannot be more than 5000 characters"],
    },
    attachments: [
      {
        type: String,
        url: String,
        fileType: {
          type: String,
          enum: ["image", "document", "other"],
        },
      },
    ],
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Message", MessageSchema)

