const express = require("express")
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
} = require("../controllers/courses")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(getCourses).post(protect, authorize("admin", "faculty"), createCourse)

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("admin", "faculty"), updateCourse)
  .delete(protect, authorize("admin"), deleteCourse)

router.route("/:id/enroll").post(protect, enrollCourse).delete(protect, unenrollCourse)

module.exports = router
