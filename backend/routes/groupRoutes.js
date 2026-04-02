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
    getRecommendedGroups,
    requestToJoinGroup,
    getJoinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    getGroupMembers,
    assignModerator
} from "../controllers/groupController.js";
import { setWeeklyTask } from "../controllers/weeklyTaskController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

import { setGroupMemberDisabled } from "../controllers/groupController.js";

// Disable/enable group member (group-scoped, moderator/admin only)
router.put("/:groupId/members/:userId/disable", authenticate, setGroupMemberDisabled);

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
router.put("/:groupId/weekly-task", authenticate, setWeeklyTask); // Set weekly task (admin or moderator)

// Admin routes
router.post("/", authenticate, authorizeRole("admin"), createGroup); // Create new group
router.put("/:groupId", authenticate, authorizeRole("admin"), updateGroup); // Update group
router.delete("/:groupId", authenticate, authorizeRole("admin"), deleteGroup); // Delete group

router.post("/:groupId/request", authenticate, requestToJoinGroup);
router.get("/:groupId/requests", authenticate, getJoinRequests);
router.put("/:groupId/requests/:requestId/approve", authenticate, approveJoinRequest);
router.put("/:groupId/requests/:requestId/reject", authenticate, rejectJoinRequest);
router.get("/:groupId/members", authenticate, authorizeRole("admin"), getGroupMembers);

// Assign moderator (admin only)
router.post("/:groupId/assign-moderator", authenticate, authorizeRole("admin"), assignModerator);

export default router;