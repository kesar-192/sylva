import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUploadSignature,
  createPost,
  getFeed,
  getUserPosts,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

// Every post route requires a valid access token - reuses the same
// middleware the auth boilerplate already had protecting /dashboard.
router.use(protect);

router.get("/upload-signature", getUploadSignature);
router.post("/", createPost);
router.get("/", getFeed);
router.get("/user/:userId", getUserPosts);
router.delete("/:postId", deletePost);

export default router;
