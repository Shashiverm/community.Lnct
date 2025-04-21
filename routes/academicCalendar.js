const express = require("express")
const {
  getCalendars,
  getCalendar,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/academicCalendar")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(getCalendars).post(protect, authorize("admin"), createCalendar)

router
  .route("/:id")
  .get(getCalendar)
  .put(protect, authorize("admin"), updateCalendar)
  .delete(protect, authorize("admin"), deleteCalendar)

router.route("/:id/events").post(protect, authorize("admin", "faculty"), addEvent)

router
  .route("/:id/events/:eventId")
  .put(protect, authorize("admin", "faculty"), updateEvent)
  .delete(protect, authorize("admin", "faculty"), deleteEvent)

module.exports = router
