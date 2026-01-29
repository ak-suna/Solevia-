import express from "express";
import {
    createReport,
    getAllReports,
    getReportById,
    updateReportStatus,
    getReportStats,
    bulkUpdateReports,
    deleteReport
} from "../controllers/reportController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", authenticate, createReport); // Submit a report

// Admin routes
router.get("/", authenticate, authorizeRole("admin"), getAllReports); // Get all reports
router.get("/stats", authenticate, authorizeRole("admin"), getReportStats); // Get statistics
router.get("/:reportId", authenticate, authorizeRole("admin"), getReportById); // Get single report
router.put("/:reportId", authenticate, authorizeRole("admin"), updateReportStatus); // Update report
router.put("/bulk/update", authenticate, authorizeRole("admin"), bulkUpdateReports); // Bulk update
router.delete("/:reportId", authenticate, authorizeRole("admin"), deleteReport); // Delete report

export default router;