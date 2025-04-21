const express = require("express")
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcements")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(getAnnouncements).post(protect, authorize("admin", "faculty"), createAnnouncement)

router
  .route("/:id")
  .get(getAnnouncement)
  .put(protect, authorize("admin", "faculty"), updateAnnouncement)
  .delete(protect, authorize("admin", "faculty"), deleteAnnouncement)

module.exports = router
