import express from "express"
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserConnections,
  connectWithUser,
  acceptConnection,
  rejectConnection,
  getUserPosts,
  updateProfileImage,
  searchUsers,
} from "../controllers/users.js"
import { authorize } from "../middleware/auth.js"

const router = express.Router()

router.get("/", getUsers)
router.get("/search", searchUsers)
router.get("/:id", getUser)
router.put("/:id", updateUser)
router.delete("/:id", authorize("admin"), deleteUser)
router.get("/:id/connections", getUserConnections)
router.post("/:id/connect", connectWithUser)
router.put("/connections/:id/accept", acceptConnection)
router.put("/connections/:id/reject", rejectConnection)
router.get("/:id/posts", getUserPosts)
router.put("/profile-image", updateProfileImage)

export default router
