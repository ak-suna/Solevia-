import express from "express";
import {
    createPost,
    getPosts,
    getPostById,
    getUserPosts,
    updatePost,
    deletePost,
    addReaction,
    addComment,
    deleteComment,
    reportPost,
    getPostsByCategory
} from "../controllers/postController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/authenticated routes
router.get("/", authenticate, getPosts); // Get all posts with pagination
router.get("/user", authenticate, getUserPosts); // Get current user's posts
router.get("/category/:category", authenticate, getPostsByCategory); // Get posts by category
router.get("/:postId", authenticate, getPostById); // Get single post
router.post("/", authenticate, createPost); // Create new post
router.put("/:postId", authenticate, updatePost); // Update post
router.delete("/:postId", authenticate, deletePost); // Delete post

// Reactions & Comments
router.post("/:postId/react", authenticate, addReaction); // Add/remove reaction
router.post("/:postId/comment", authenticate, addComment); // Add comment
router.delete("/:postId/comment/:commentId", authenticate, deleteComment); // Delete comment

// Reporting
router.post("/:postId/report", authenticate, reportPost); // Report a post

export default router;