import express from "express"
import {
  getResources,
  createResource,
  getResource,
  updateResource,
  deleteResource,
  likeResource,
  unlikeResource,
  downloadResource,
  searchResources,
} from "../controllers/resources.js"

const router = express.Router()

router.get("/", getResources)
router.post("/", createResource)
router.get("/search", searchResources)
router.get("/:id", getResource)
router.put("/:id", updateResource)
router.delete("/:id", deleteResource)
router.post("/:id/like", likeResource)
router.delete("/:id/like", unlikeResource)
router.get("/:id/download", downloadResource)

export default router

