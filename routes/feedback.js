const express = require("express")
const {
  submitFeedback,
  getFeedback,
  getUserFeedback,
  getSingleFeedback,
  updateFeedback,
  respondToFeedback,
  deleteFeedback,
} = require("../controllers/feedback")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(protect, authorize("admin", "faculty"), getFeedback).post(protect, submitFeedback)

router.route("/me").get(protect, getUserFeedback)

router.route("/:id").get(protect, getSingleFeedback).put(protect, updateFeedback).delete(protect, deleteFeedback)

router.route("/:id/respond").put(protect, authorize("admin", "faculty"), respondToFeedback)

module.exports = router
