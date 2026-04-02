import { SupportGroup } from "../models/SupportGroup.js";

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

        group.weeklyTask = {
            task: task,
            week: Date.now(),
            completedBy: []
        };
        await group.save();
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
