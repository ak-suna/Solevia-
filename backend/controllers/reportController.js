import { Report } from "../models/Report.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

// Create a report
export const createReport = async (req, res) => {
    try {
        const { targetId, reportType, reason, description } = req.body;
        const userId = req.user.id;

        if (!targetId || !reportType || !reason) {
            return res.status(400).json({
                error: "Target ID, report type, and reason are required"
            });
        }

        // Check if user already reported this item
        const existingReport = await Report.findOne({
            reportedBy: userId,
            targetId,
            reportType
        });

        if (existingReport) {
            return res.status(400).json({
                error: "You have already reported this item"
            });
        }

        const report = new Report({
            reportedBy: userId,
            targetId,
            reportType,
            reason,
            description: description || ""
        });

        await report.save();

        // Update the reported item
        if (reportType === "post") {
            const post = await Post.findById(targetId);
            if (post) {
                post.reportCount += 1;
                post.isReported = true;
                await post.save();
            }
        }

        res.status(201).json({
            message: "Report submitted successfully. Our team will review it.",
            report
        });
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ error: "Failed to submit report" });
    }
};

// Get all reports (admin only)
export const getAllReports = async (req, res) => {
    try {
        const { status = "pending", reportType, page = 1, limit = 20 } = req.query;

        const query = {};

        if (status && status !== "all") {
            query.status = status;
        }

        if (reportType && reportType !== "all") {
            query.reportType = reportType;
        }

        const reports = await Report.find(query)
            .populate('reportedBy', 'firstName lastName email')
            .populate('reviewedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Populate target details based on reportType
        for (let report of reports) {
            if (report.reportType === "post") {
                const post = await Post.findById(report.targetId)
                    .populate('userId', 'firstName lastName')
                    .lean();
                report.targetDetails = post;
            } else if (report.reportType === "user") {
                const user = await User.findById(report.targetId)
                    .select('firstName lastName email')
                    .lean();
                report.targetDetails = user;
            }
        }

        const count = await Report.countDocuments(query);

        res.status(200).json({
            reports,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Failed to fetch reports" });
    }
};

// Get single report by ID (admin only)
export const getReportById = async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = await Report.findById(reportId)
            .populate('reportedBy', 'firstName lastName email')
            .populate('reviewedBy', 'firstName lastName')
            .lean();

        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        // Populate target details
        if (report.reportType === "post") {
            const post = await Post.findById(report.targetId)
                .populate('userId', 'firstName lastName')
                .lean();
            report.targetDetails = post;
        } else if (report.reportType === "user") {
            const user = await User.findById(report.targetId)
                .select('firstName lastName email role')
                .lean();
            report.targetDetails = user;
        }

        res.status(200).json({ report });
    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ error: "Failed to fetch report" });
    }
};

// Update report status (admin only)
export const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, action, adminNotes } = req.body;
        const adminId = req.user.id;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        report.status = status;

        if (action) {
            report.action = action;

            // Take action based on decision
            if (report.reportType === "post") {
                const post = await Post.findById(report.targetId);
                if (post) {
                    if (action === "content-removed") {
                        post.isHidden = true;
                        await post.save();
                    }
                }
            }
            // User suspension/ban would be handled separately
        }

        if (adminNotes) {
            report.adminNotes = adminNotes;
        }

        if (status === "resolved" || status === "dismissed") {
            report.reviewedBy = adminId;
            report.reviewedAt = Date.now();
        }

        await report.save();
        await report.populate('reportedBy', 'firstName lastName email');
        await report.populate('reviewedBy', 'firstName lastName');

        res.status(200).json({
            message: "Report updated successfully",
            report
        });
    } catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({ error: "Failed to update report" });
    }
};

// Get report statistics (admin only)
export const getReportStats = async (req, res) => {
    try {
        const totalReports = await Report.countDocuments();
        const pendingReports = await Report.countDocuments({ status: "pending" });
        const resolvedReports = await Report.countDocuments({ status: "resolved" });
        const dismissedReports = await Report.countDocuments({ status: "dismissed" });

        const reportsByType = await Report.aggregate([
            {
                $group: {
                    _id: "$reportType",
                    count: { $sum: 1 }
                }
            }
        ]);

        const reportsByReason = await Report.aggregate([
            {
                $group: {
                    _id: "$reason",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            totalReports,
            pendingReports,
            resolvedReports,
            dismissedReports,
            reportsByType,
            reportsByReason
        });
    } catch (error) {
        console.error("Error fetching report stats:", error);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
};

// Bulk update reports (admin only)
export const bulkUpdateReports = async (req, res) => {
    try {
        const { reportIds, status, action } = req.body;
        const adminId = req.user.id;

        if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
            return res.status(400).json({ error: "Report IDs array is required" });
        }

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const updateData = {
            status,
            reviewedBy: adminId,
            reviewedAt: Date.now()
        };

        if (action) {
            updateData.action = action;
        }

        await Report.updateMany(
            { _id: { $in: reportIds } },
            updateData
        );

        res.status(200).json({
            message: `${reportIds.length} reports updated successfully`
        });
    } catch (error) {
        console.error("Error bulk updating reports:", error);
        res.status(500).json({ error: "Failed to update reports" });
    }
};

// Delete report (admin only - use sparingly)
export const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = await Report.findByIdAndDelete(reportId);

        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ error: "Failed to delete report" });
    }
};