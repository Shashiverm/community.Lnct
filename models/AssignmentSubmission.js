const mongoose = require("mongoose")

const AssignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachments: [
    {
      filename: String,
      path: String,
      mimetype: String,
    },
  ],
  comment: {
    type: String,
    default: "",
  },
  score: {
    type: Number,
    default: null,
  },
  feedback: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["submitted", "graded", "late", "resubmitted"],
    default: "submitted",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  gradedAt: {
    type: Date,
  },
})

module.exports = mongoose.model("AssignmentSubmission", AssignmentSubmissionSchema)
