import express from "express"
import {
  getEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  attendEvent,
  updateAttendance,
  getEventAttendees,
  cancelEvent,
} from "../controllers/events.js"

const router = express.Router()

router.get("/", getEvents)
router.post("/", createEvent)
router.get("/:id", getEvent)
router.put("/:id", updateEvent)
router.delete("/:id", deleteEvent)
router.post("/:id/attend", attendEvent)
router.put("/:id/attendance", updateAttendance)
router.get("/:id/attendees", getEventAttendees)
router.put("/:id/cancel", cancelEvent)

export default router

