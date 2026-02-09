import express from "express";
import {
    getModeratorCandidates,
    promoteToModerator,
    removeModerator,
    getModeratedGroups
} from "../controllers/moderatorController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only - view candidates and promote/remove
router.get("/candidates/:groupId", authenticate, authorizeRole("admin"), getModeratorCandidates);
router.post("/promote", authenticate, authorizeRole("admin"), promoteToModerator);
router.delete("/:groupId/:userId", authenticate, authorizeRole("admin"), removeModerator);

// Moderator - view their groups
router.get("/my-groups", authenticate, getModeratedGroups);

export default router;