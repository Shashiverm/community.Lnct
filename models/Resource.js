import mongoose from "mongoose"

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a resource title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a resource description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide a resource category"],
      enum: ["Academic", "Technical", "Career", "Research", "Other"],
    },
    type: {
      type: String,
      required: [true, "Please provide a resource type"],
      enum: ["PDF", "Document", "Repository", "Link", "Course", "Video", "Other"],
    },
    url: {
      type: String,
      required: [true, "Please provide a resource URL"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
ResourceSchema.virtual("likeCount").get(function () {
  return this.likes.length
})

// Set virtuals to true when converting to JSON
ResourceSchema.set("toJSON", { virtuals: true })
ResourceSchema.set("toObject", { virtuals: true })

export default mongoose.model("Resource", ResourceSchema)
