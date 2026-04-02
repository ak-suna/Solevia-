import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getGroupReports,
  resolveGroupReport,
  removeGroupMember,
  disableGroupMember
} from "../controllers/moderatorToolsController.js";

const router = express.Router();

// Reports
router.get("/:groupId/reports", authenticate, getGroupReports);
router.put("/:groupId/reports/:reportId/resolve", authenticate, resolveGroupReport);

// Member management
router.delete("/:groupId/members/:userId", authenticate, removeGroupMember);
router.put("/:groupId/members/:userId/disable", authenticate, disableGroupMember);

export default router;
