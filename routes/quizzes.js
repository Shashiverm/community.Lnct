const express = require("express")
const {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuizAttempt,
  getQuizAttempts,
  getQuizAttempt,
  addQuizFeedback,
} = require("../controllers/quizzes")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(protect, getQuizzes).post(protect, authorize("faculty", "admin"), createQuiz)

router
  .route("/:id")
  .get(protect, getQuiz)
  .put(protect, authorize("faculty", "admin"), updateQuiz)
  .delete(protect, authorize("faculty", "admin"), deleteQuiz)

router.route("/:id/attempt").post(protect, submitQuizAttempt)

router.route("/attempts").get(protect, getQuizAttempts)

router.route("/attempts/:id").get(protect, getQuizAttempt)

router.route("/attempts/:id/feedback").put(protect, authorize("faculty", "admin"), addQuizFeedback)

module.exports = router
