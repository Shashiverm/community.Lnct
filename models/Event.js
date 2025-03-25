import mongoose from "mongoose"

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an event title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide an event description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Please provide an event date"],
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
      required: [true, "Please provide an event location"],
    },
    category: {
      type: String,
      required: [true, "Please provide an event category"],
      enum: ["Technical", "Networking", "Career", "Academic", "Cultural", "Competition", "Other"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["attending", "maybe", "not attending"],
          default: "attending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    image: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    maxAttendees: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for attendee count
EventSchema.virtual("attendeeCount").get(function () {
  return this.attendees.filter((a) => a.status === "attending").length
})

// Set virtuals to true when converting to JSON
EventSchema.set("toJSON", { virtuals: true })
EventSchema.set("toObject", { virtuals: true })

export default mongoose.model("Event", EventSchema)

