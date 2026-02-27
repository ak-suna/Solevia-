import express from "express";
import { toggleReaction } from "../controllers/reactionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle", authenticate, toggleReaction);

export default router;
