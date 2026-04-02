import { SupportGroup } from "../models/SupportGroup.js";
import { Report } from "../models/Report.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

// Get all reports for a group (pending/under-review)
export const getGroupReports = async (req, res) => {
  try {
    const { groupId } = req.params;
    // Find all posts and users in this group
    const group = await SupportGroup.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    const postIds = await Post.find({ groupId }).distinct("_id");
    const userIds = group.members.map(m => m.userId);
    // Find reports for posts or users in this group
    const reports = await Report.find({
      $or: [
        { reportType: "post", targetId: { $in: postIds } },
        { reportType: "user", targetId: { $in: userIds } }
      ],
      status: { $in: ["pending", "under-review"] }
    })
      .populate("reportedBy", "firstName lastName email")
      .lean();
    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching group reports:", error);
    res.status(500).json({ error: "Failed to fetch group reports" });
  }
};

// Resolve a report (moderator)
export const resolveGroupReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ error: "Report not found" });
    report.status = "resolved";
    report.reviewedBy = req.user.id;
    report.reviewedAt = new Date();
    await report.save();
    res.status(200).json({ message: "Report resolved", report });
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).json({ error: "Failed to resolve report" });
  }
};

// Remove a member from group
export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await SupportGroup.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    group.members = group.members.filter(m => m.userId.toString() !== userId);
    await group.save();
    res.status(200).json({ message: "Member removed" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

// Disable/enable a member in group
export const disableGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const { disabled, reason } = req.body;
    const group = await SupportGroup.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    const member = group.members.find(m => m.userId.toString() === userId);
    if (!member) return res.status(404).json({ error: "Member not found" });
    if (disabled) {
      if (!reason || reason.trim() === "") {
        return res.status(400).json({ error: "A reason is required to disable a member." });
      }
      member.disabled = true;
      member.disabledReason = reason;
      // Send notification to user
      const notificationService = (await import("../services/notificationService.js")).default;
      await notificationService.createNotification({
        userId,
        type: "GROUP_MEMBER_DISABLED",
        title: `You have been disabled in group ${group.name}`,
        message: `A moderator has disabled you in the group. Reason: ${reason}`,
        data: { groupId, groupName: group.name, reason },
      });
    } else {
      member.disabled = false;
      member.disabledReason = "";
    }
    await group.save();
    res.status(200).json({ message: `Member ${disabled ? "disabled" : "enabled"}` });
  } catch (error) {
    console.error("Error disabling/enabling member:", error);
    res.status(500).json({ error: "Failed to update member status" });
  }
};
