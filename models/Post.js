import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for faster queries
    },
    content: {
      type: String,
      required: [true, "Please add content to your post"],
      trim: true,
      maxlength: [5000, "Post content cannot be more than 5000 characters"],
    },
    images: [String],
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: [1000, "Comment cannot be more than 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      index: true, // Add index for faster queries
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Create text index for search
PostSchema.index({ content: "text", tags: "text" })

// Create compound index for faster filtering
PostSchema.index({ user: 1, createdAt: -1 })
PostSchema.index({ isPublic: 1, createdAt: -1 })

export default mongoose.model("Post", PostSchema)
