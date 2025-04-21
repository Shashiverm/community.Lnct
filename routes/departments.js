const express = require("express")
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addFacultyToDepartment,
  removeFacultyFromDepartment,
} = require("../controllers/departments")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(getDepartments).post(protect, authorize("admin"), createDepartment)

router
  .route("/:id")
  .get(getDepartment)
  .put(protect, authorize("admin"), updateDepartment)
  .delete(protect, authorize("admin"), deleteDepartment)

router
  .route("/:id/faculty/:userId")
  .put(protect, authorize("admin"), addFacultyToDepartment)
  .delete(protect, authorize("admin"), removeFacultyFromDepartment)

module.exports = router
