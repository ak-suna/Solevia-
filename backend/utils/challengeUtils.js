import { Challenge } from "../models/Challenge.js";
import { ChallengeParticipant } from "../models/ChallengeParticipant.js";
import { ChallengeTemplate } from "../models/ChallengeTemplate.js";
import { User } from "../models/User.js";
import notificationService from "../services/notificationService.js";

// Helper to update progress for mood and journal instantly
export const updateChallengeProgress = async (userId, trackingType, dateStr) => {
    try {
        const activeChallenges = await Challenge.find({
            status: "active",
            trackingType
        });

        for (const challenge of activeChallenges) {
            const participant = await ChallengeParticipant.findOne({
                userId,
                challengeId: challenge._id
            });

            if (!participant) continue;

            const dayEntry = participant.days.find(d => d.date === dateStr);
            if (!dayEntry || dayEntry.completed) continue;

            dayEntry.completed = true;
            const completedCount = participant.days.filter(d => d.completed).length;
            participant.completionPercentage = Math.round(
                (completedCount / participant.days.length) * 100
            );

            // If reached 80%, mark completed and notify
            if (!participant.isCompleted && participant.completionPercentage >= 80) {
                participant.isCompleted = true;
                participant.badgeAwarded = true;
                
                try {
                    await notificationService.createNotification({
                        userId: participant.userId,
                        type: "CHALLENGE_COMPLETED",
                        title: "🏆 Challenge Complete!",
                        message: `You completed the "${challenge.title}" challenge! Badge awarded.`,
                        data: { challengeId: challenge._id, actionUrl: "/challenges" }
                    });
                } catch (err) {
                    console.error("[challengeUtils] Failed to notify participant:", participant.userId, err.message);
                }
            }

            await participant.save();
            console.log(`[challengeUtils] Instantly updated challenge progress for user ${userId}, type: ${trackingType}`);
        }
    } catch (error) {
        console.error("[challengeUtils] Error updating challenge progress:", error);
    }
};

export const activateChallengeFromTemplate = async () => {
    console.log("[challengeUtils] Activating challenge from template...");
    try {
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const eligible = await ChallengeTemplate.find({
            status: "active",
            $or: [
                { lastUsedAt: null },
                { lastUsedAt: { $lt: sixtyDaysAgo } }
            ]
        });

        if (eligible.length === 0) {
            console.log("[challengeUtils] No eligible templates. Notifying admins.");
            const admins = await User.find({ role: "admin" });
            for (const admin of admins) {
                try {
                    await notificationService.createNotification({
                        userId: admin._id,
                        type: "CHALLENGE_POOL_LOW",
                        title: "⚠️ Challenge Pool Empty",
                        message: "No eligible challenge templates available this week. All templates used within 60 days.",
                        data: { actionUrl: "/admin/challenges" }
                    });
                } catch (err) {
                    console.error("[challengeUtils] Failed to notify admin:", admin._id, err.message);
                }
            }
            return;
        }

        const template = eligible[Math.floor(Math.random() * eligible.length)];

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + template.duration);

        const challenge = await Challenge.create({
            templateId: template._id,
            title: template.title,
            description: template.description,
            trackingType: template.trackingType,
            duration: template.duration,
            difficulty: template.difficulty,
            status: "active",
            startDate,
            endDate,
            participantCount: 0
        });

        template.lastUsedAt = new Date();
        await template.save();

        console.log(`[challengeUtils] Challenge created: ${challenge.title}`);
        return challenge;
    } catch (error) {
        console.error("[challengeUtils] Error activating challenge from template:", error);
    }
};
