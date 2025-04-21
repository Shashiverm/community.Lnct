const express = require("express")
const {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getAssignmentSubmissions,
  getUserSubmissions,
  gradeSubmission,
} = require("../controllers/assignments")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(protect, getAssignments).post(protect, authorize("faculty", "admin"), createAssignment)

router
  .route("/:id")
  .get(protect, getAssignment)
  .put(protect, authorize("faculty", "admin"), updateAssignment)
  .delete(protect, authorize("faculty", "admin"), deleteAssignment)

router.route("/:id/submit").post(protect, submitAssignment)

router.route("/:id/submissions").get(protect, authorize("faculty", "admin"), getAssignmentSubmissions)

router.route("/submissions").get(protect, getUserSubmissions)

router.route("/submissions/:id").put(protect, authorize("faculty", "admin"), gradeSubmission)

module.exports = router
