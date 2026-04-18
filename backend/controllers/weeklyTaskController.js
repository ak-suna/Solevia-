import { SupportGroup } from "../models/SupportGroup.js";
import agenda from "../jobs/notificationJobs.js";

// Set or update the weekly task (admin or moderator)
export const setWeeklyTask = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { task } = req.body;

        const userId = req.user && (req.user.id || req.user._id) ? (req.user.id || req.user._id).toString() : null;
        const group = await SupportGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Defensive: safely get string values or null
        const moderatorIdStr = group.moderatorId ? group.moderatorId.toString() : null;
        const createdByStr = group.createdBy ? group.createdBy.toString() : null;
        // Debug logging for troubleshooting
        console.log('[setWeeklyTask] userId:', userId, 'moderatorId:', moderatorIdStr, 'createdBy:', createdByStr, 'userRole:', req.user.role);

        const isAdmin = req.user.role === 'admin';
        const isModeratorId = moderatorIdStr && moderatorIdStr === userId;
        const isModeratorRole = Array.isArray(group.members) && group.members.some(
            m => m.userId && m.userId.toString() === userId && m.role === "moderator"
        );
        console.log('[setWeeklyTask] isAdmin:', isAdmin, 'isModeratorId:', isModeratorId, 'isModeratorRole:', isModeratorRole);
        if (!isAdmin && !isModeratorId && !isModeratorRole) {
            console.log('[setWeeklyTask] Permission denied');
            return res.status(403).json({ error: "Only admins and moderators can set the weekly task" });
        }

        // Calculate the start of the current week (Monday 00:00)
        const now = new Date();
        const day = now.getDay(); // 0 (Sun) - 6 (Sat)
        const diffToMonday = (day === 0 ? -6 : 1) - day; // If Sunday, go back 6 days, else back to Monday
        const monday = new Date(now);
        monday.setHours(0, 0, 0, 0);
        monday.setDate(now.getDate() + diffToMonday);
        const weekStart = monday.getTime();

        // Prevent multiple tasks for the same week
        if (group.weeklyTask && group.weeklyTask.week === weekStart) {
            return res.status(400).json({ error: "A weekly task already exists for this week. Wait until next week to set a new one." });
        }

        group.weeklyTask = {
            task: task,
            week: weekStart,
            completedBy: []
        };
        await group.save();

        // Schedule Agenda job for task end (next Monday 00:00)
        const jobName = "auto-group-task-complete-post";
        const jobUnique = { groupId: group._id.toString(), week: weekStart };
        const nextMonday = new Date(monday);
        nextMonday.setDate(monday.getDate() + 7);
        // Cancel any existing job for this group/week
        await agenda.cancel({ name: jobName, "data.groupId": group._id.toString(), "data.week": weekStart });
        await agenda.schedule(nextMonday, jobName, jobUnique);

        // Populate members and createdBy for frontend display
        await group.populate([
            { path: 'createdBy', select: 'firstName lastName' },
            { path: 'members.userId', select: 'firstName lastName email points' }
        ]);
        res.status(200).json({ message: "Weekly task updated", group });
    } catch (error) {
        console.error("Error setting weekly task:", error);
        res.status(500).json({ error: "Failed to set weekly task" });
    }
};
