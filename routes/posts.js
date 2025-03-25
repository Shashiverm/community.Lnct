import express from "express"
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  getPostComments,
} from "../controllers/posts.js"

const router = express.Router()

router.get("/", getPosts)
router.post("/", createPost)
router.get("/:id", getPost)
router.put("/:id", updatePost)
router.delete("/:id", deletePost)
router.post("/:id/like", likePost)
router.delete("/:id/like", unlikePost)
router.post("/:id/comments", addComment)
router.delete("/:id/comments/:commentId", deleteComment)
router.get("/:id/comments", getPostComments)

export default router

