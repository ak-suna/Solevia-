import express from "express";
import {
    getAllGroups,
    getGroupById,
    getUserGroups,
    joinGroup,
    leaveGroup,
    getGroupPosts,
    completeWeeklyTask,
    createGroup,
    updateGroup,
    deleteGroup,
    getRecommendedGroups
} from "../controllers/groupController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/authenticated routes
router.get("/", authenticate, getAllGroups); // Get all groups with filters
router.get("/recommended", authenticate, getRecommendedGroups); // Get recommended groups
router.get("/user", authenticate, getUserGroups); // Get user's joined groups
router.get("/:groupId", authenticate, getGroupById); // Get single group
router.get("/:groupId/posts", authenticate, getGroupPosts); // Get group posts (members only)

// Join/Leave group
router.post("/:groupId/join", authenticate, joinGroup); // Join a group
router.post("/:groupId/leave", authenticate, leaveGroup); // Leave a group

// Weekly tasks
router.post("/:groupId/complete-task", authenticate, completeWeeklyTask); // Complete weekly task

// Admin routes
router.post("/", authenticate, authorizeRole("admin"), createGroup); // Create new group
router.put("/:groupId", authenticate, authorizeRole("admin"), updateGroup); // Update group
router.delete("/:groupId", authenticate, authorizeRole("admin"), deleteGroup); // Delete group

export default router;