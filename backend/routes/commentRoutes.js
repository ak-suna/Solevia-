import express from "express";
import {
    getCommentsByPost,
    addComment,
    deleteOwnComment
} from "../controllers/commentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/post/:postId", authenticate, getCommentsByPost);
router.post("/", authenticate, addComment);
router.delete("/:commentId", authenticate, deleteOwnComment);

export default router;
