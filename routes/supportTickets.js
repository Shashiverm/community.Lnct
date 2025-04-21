const express = require("express")
const {
  getTickets,
  getUserTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  addComment,
  resolveTicket,
} = require("../controllers/supportTickets")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(protect, authorize("admin", "staff"), getTickets).post(protect, createTicket)

router.route("/me").get(protect, getUserTickets)

router.route("/:id").get(protect, getTicket).put(protect, updateTicket).delete(protect, deleteTicket)

router.route("/:id/assign").put(protect, authorize("admin", "staff"), assignTicket)

router.route("/:id/comments").post(protect, addComment)

router.route("/:id/resolve").put(protect, authorize("admin", "staff"), resolveTicket)

module.exports = router
