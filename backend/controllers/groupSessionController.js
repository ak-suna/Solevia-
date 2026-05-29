import { GroupSession } from "../models/GroupSession.js";
import { SupportGroup } from "../models/SupportGroup.js";
import { User } from "../models/User.js";
import notificationService from "../services/notificationService.js";
import agenda from "../jobs/notificationJobs.js";

// Create a session (moderator or admin only)
export const createSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { groupId } = req.params;
        const { topic, description, scheduledAt, calendlyLink } = req.body;

        if (!topic || !scheduledAt) {
            return res.status(400).json({ error: "Topic and scheduled time are required" });
        }

        const group = await SupportGroup.findById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found" });

        const member = group.members.find(m => m.userId.toString() === userId);
        const isModerator = member && (member.role === "moderator" || member.role === "admin");
        if (!isModerator && req.user.role !== "admin") {
            return res.status(403).json({ error: "Only moderators can create sessions" });
        }

        const scheduledDate = new Date(scheduledAt);
        if (scheduledDate <= new Date()) {
            return res.status(400).json({ error: "Session must be scheduled in the future" });
        }

        const session = await GroupSession.create({
            groupId,
            createdBy: userId,
            topic,
            description: description || "",
            scheduledAt: scheduledDate,
            calendlyLink: calendlyLink || ""
        });

        // Notify all group members
        const memberIds = group.members
            .filter(m => !m.disabled && m.userId.toString() !== userId)
            .map(m => m.userId);

        await notificationService.createBulkNotifications(memberIds, {
            type: "GROUP_SESSION_CREATED",
            title: `New Session: ${topic}`,
            message: `A new group session has been scheduled for ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
            data: {
                sessionId: session._id,
                groupId,
                topic,
                sessionDate: scheduledDate.toISOString().split("T")[0],
                actionUrl: `/user/dashboard?date=${scheduledDate.toISOString().split("T")[0]}`
            }
        });

        // Schedule auto-post at session time using existing Agenda instance
        await agenda.schedule(scheduledDate, "auto-group-session-post", {
            sessionId: session._id.toString(),
            groupId: groupId.toString()
        });
        const inactiveAt = new Date(scheduledDate.getTime() + (3 * 60 * 60 * 1000));
        await agenda.schedule(inactiveAt, "auto-group-session-inactive", {
            sessionId: session._id.toString()
        });

        res.status(201).json({ message: "Session created", session });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "Failed to create session" });
    }
};

// Get sessions for a group
export const getGroupSessions = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;
        const now = new Date();
        const inactiveCutoff = new Date(now.getTime() - (3 * 60 * 60 * 1000));

        const group = await SupportGroup.findById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found" });

        const isMember = group.members.some(m => m.userId.toString() === userId && !m.disabled);
        if (!isMember) return res.status(403).json({ error: "Members only" });

        // Fallback safety: if a scheduled job was missed, mark old sessions inactive during read.
        await GroupSession.updateMany(
            {
                groupId,
                status: { $in: ["upcoming", "active"] },
                scheduledAt: { $lte: inactiveCutoff }
            },
            { $set: { status: "inactive" } }
        );

        const sessions = await GroupSession.find({ groupId })
            .populate("createdBy", "firstName lastName")
            .sort({ scheduledAt: 1 });

        // Attach RSVP status for current user
        const enriched = sessions.map(s => ({
            ...s.toObject(),
            hasRsvp: s.rsvps.some(r => r.userId.toString() === userId),
            rsvpCount: s.rsvps.length
        }));

        res.status(200).json({ sessions: enriched });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
};

// RSVP to a session
export const rsvpSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sessionId } = req.params;

        const session = await GroupSession.findById(sessionId);
        if (!session) return res.status(404).json({ error: "Session not found" });

        const alreadyRsvp = session.rsvps.some(r => r.userId.toString() === userId);
        if (alreadyRsvp) {
            // Toggle off
            session.rsvps = session.rsvps.filter(r => r.userId.toString() !== userId);
            await session.save();
            return res.status(200).json({ message: "RSVP removed", hasRsvp: false });
        }

        session.rsvps.push({ userId });
        await session.save();
        res.status(200).json({ message: "RSVP confirmed", hasRsvp: true });
    } catch (error) {
        console.error("Error RSVPing:", error);
        res.status(500).json({ error: "Failed to RSVP" });
    }
};

// Delete a session (moderator/admin only)
export const deleteSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sessionId } = req.params;

        const session = await GroupSession.findById(sessionId);
        if (!session) return res.status(404).json({ error: "Session not found" });

        const group = await SupportGroup.findById(session.groupId);
        const member = group?.members.find(m => m.userId.toString() === userId);
        const canDelete = req.user.role === "admin" ||
            session.createdBy.toString() === userId ||
            (member && (member.role === "moderator" || member.role === "admin"));

        if (!canDelete) return res.status(403).json({ error: "Not authorized" });

        await GroupSession.findByIdAndDelete(sessionId);
        res.status(200).json({ message: "Session deleted" });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ error: "Failed to delete session" });
    }
};