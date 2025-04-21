import express from "express"
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  createConversation,
  deleteMessage,
  deleteConversation,
} from "../controllers/messages.js"

const router = express.Router()

router.get("/conversations", getConversations)
router.post("/conversations", createConversation)
router.delete("/conversations/:id", deleteConversation)
router.get("/conversations/:id", getMessages)
router.post("/", sendMessage)
router.put("/:id/read", markAsRead)
router.delete("/:id", deleteMessage)

export default router
