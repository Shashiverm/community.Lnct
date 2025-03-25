import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please provide post content"],
      maxlength: [5000, "Post cannot be more than 5000 characters"],
    },
    media: [
      {
        type: String,
        url: String,
        mediaType: {
          type: String,
          enum: ["image", "video", "document"],
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
    visibility: {
      type: String,
      enum: ["public", "connections", "private"],
      default: "public",
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

// Virtual for like count
PostSchema.virtual("likeCount").get(function () {
  return this.likes.length
})

// Virtual for comment count
PostSchema.virtual("commentCount").get(function () {
  return this.comments.length
})

// Set virtuals to true when converting to JSON
PostSchema.set("toJSON", { virtuals: true })
PostSchema.set("toObject", { virtuals: true })

export default mongoose.model("Post", PostSchema)

