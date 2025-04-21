import express from "express"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  updateNotificationSettings,
} from "../controllers/notifications.js"

const router = express.Router()

router.get("/", getNotifications)
router.put("/:id/read", markAsRead)
router.put("/read-all", markAllAsRead)
router.delete("/:id", deleteNotification)
router.put("/settings", updateNotificationSettings)

export default router
