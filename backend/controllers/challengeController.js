import { Challenge } from "../models/Challenge.js";
import { ChallengeTemplate } from "../models/ChallengeTemplate.js";
import { ChallengeParticipant } from "../models/ChallengeParticipant.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import notificationService from "../services/notificationService.js";

// ==================== TEMPLATE ENDPOINTS (ADMIN) ====================

export const createTemplate = async (req, res) => {
    try {
        const { title, description, trackingType, duration, difficulty } = req.body;

        if (!title || !description || !trackingType || !duration || !difficulty) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const template = await ChallengeTemplate.create({
            title: title.trim(),
            description: description.trim(),
            trackingType,
            duration,
            difficulty,
            status: "active"
        });

        res.status(201).json({ message: "Template created successfully", template });
    } catch (error) {
        console.error("Error creating template:", error);
        res.status(500).json({ error: "Failed to create template" });
    }
};

export const getAllTemplates = async (req, res) => {
    try {
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const templates = await ChallengeTemplate.find().sort({ createdAt: -1 }).lean();

        const templatesWithEligibility = templates.map(t => ({
            ...t,
            isEligible: !t.lastUsedAt || new Date(t.lastUsedAt) < sixtyDaysAgo
        }));

        const eligibleCount = templatesWithEligibility.filter(t => t.isEligible && t.status === "active").length;

        res.status(200).json({ templates: templatesWithEligibility, eligibleCount });
    } catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json({ error: "Failed to fetch templates" });
    }
};

export const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, trackingType, duration, difficulty, status } = req.body;

        const template = await ChallengeTemplate.findByIdAndUpdate(
            id,
            { title, description, trackingType, duration, difficulty, status },
            { new: true }
        );

        if (!template) return res.status(404).json({ error: "Template not found" });

        res.status(200).json({ message: "Template updated", template });
    } catch (error) {
        console.error("Error updating template:", error);
        res.status(500).json({ error: "Failed to update template" });
    }
};

export const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;

        const activeChallenge = await Challenge.findOne({ templateId: id, status: "active" });
        if (activeChallenge) {
            return res.status(400).json({ error: "Cannot delete template with an active live challenge running from it" });
        }

        await ChallengeTemplate.findByIdAndDelete(id);
        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        console.error("Error deleting template:", error);
        res.status(500).json({ error: "Failed to delete template" });
    }
};

// ==================== LIVE CHALLENGE ENDPOINTS (USER) ====================

export const getAllChallenges = async (req, res) => {
    try {
        const userId = req.user.id;

        const challenges = await Challenge.find({ status: "active" })
            .sort({ createdAt: -1 })
            .lean();

        const participations = await ChallengeParticipant.find({
            userId,
            challengeId: { $in: challenges.map(c => c._id) }
        }).lean();

        const participationMap = {};
        for (const p of participations) {
            participationMap[p.challengeId.toString()] = p;
        }

        const result = challenges.map(c => {
            const participation = participationMap[c._id.toString()];
            return {
                ...c,
                isJoined: !!participation,
                completionPercentage: participation ? participation.completionPercentage : 0,
                daysRemaining: Math.max(0, Math.ceil((new Date(c.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
            };
        });

        res.status(200).json({ challenges: result });
    } catch (error) {
        console.error("Error fetching challenges:", error);
        res.status(500).json({ error: "Failed to fetch challenges" });
    }
};

export const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const challenge = await Challenge.findById(id).lean();
        if (!challenge) return res.status(404).json({ error: "Challenge not found" });

        const participation = await ChallengeParticipant.findOne({ userId, challengeId: id }).lean();

        const today = new Date().toISOString().split("T")[0];
        const totalParticipants = challenge.participantCount;

        let completedTodayCount = 0;
        if (participation) {
            const allParticipants = await ChallengeParticipant.find({ challengeId: id }).lean();
            completedTodayCount = allParticipants.filter(p =>
                p.days.find(d => d.date === today && d.completed)
            ).length;
        }

        res.status(200).json({
            challenge,
            isJoined: !!participation,
            days: participation ? participation.days : [],
            completionPercentage: participation ? participation.completionPercentage : 0,
            isCompleted: participation ? participation.isCompleted : false,
            completedTodayCount,
            totalParticipants
        });
    } catch (error) {
        console.error("Error fetching challenge:", error);
        res.status(500).json({ error: "Failed to fetch challenge" });
    }
};

export const joinChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const challenge = await Challenge.findById(id);
        if (!challenge) return res.status(404).json({ error: "Challenge not found" });
        if (challenge.status !== "active") return res.status(400).json({ error: "Challenge is not active" });

        const existing = await ChallengeParticipant.findOne({ userId, challengeId: id });
        if (existing) return res.status(400).json({ error: "You have already joined this challenge" });

        const days = [];
        const start = new Date(challenge.startDate);
        for (let i = 0; i < challenge.duration; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            days.push({ date: d.toISOString().split("T")[0], completed: false });
        }

        await ChallengeParticipant.create({
            userId,
            challengeId: id,
            days,
            completionPercentage: 0,
            isCompleted: false,
            badgeAwarded: false
        });

        challenge.participantCount += 1;
        await challenge.save();

        res.status(200).json({ message: "Successfully joined the challenge" });
    } catch (error) {
        console.error("Error joining challenge:", error);
        res.status(500).json({ error: "Failed to join challenge" });
    }
};

export const leaveChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const participant = await ChallengeParticipant.findOneAndDelete({ userId, challengeId: id });
        if (!participant) return res.status(400).json({ error: "You are not a participant of this challenge" });

        await Challenge.findByIdAndUpdate(id, { $inc: { participantCount: -1 } });

        res.status(200).json({ message: "Successfully left the challenge" });
    } catch (error) {
        console.error("Error leaving challenge:", error);
        res.status(500).json({ error: "Failed to leave challenge" });
    }
};

export const completeToday = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const challenge = await Challenge.findById(id);
        if (!challenge) return res.status(404).json({ error: "Challenge not found" });
        if (challenge.trackingType !== "manual") {
            return res.status(400).json({ error: "This challenge is auto tracked. No manual completion needed." });
        }
        if (challenge.status === "expired") {
            return res.status(400).json({ error: "Challenge has expired" });
        }

        const participant = await ChallengeParticipant.findOne({ userId, challengeId: id });
        if (!participant) return res.status(400).json({ error: "You are not a participant of this challenge" });

        const todayStr = new Date().toISOString().split("T")[0];
        const dayEntry = participant.days.find(d => d.date === todayStr);

        if (!dayEntry) return res.status(400).json({ error: "Today is not part of this challenge's schedule" });
        if (dayEntry.completed) return res.status(400).json({ error: "Already marked as complete for today" });

        dayEntry.completed = true;
        const completedCount = participant.days.filter(d => d.completed).length;
        participant.completionPercentage = Math.round((completedCount / participant.days.length) * 100);
        await participant.save();

        res.status(200).json({ message: "Marked as complete for today", completionPercentage: participant.completionPercentage });
    } catch (error) {
        console.error("Error completing today:", error);
        res.status(500).json({ error: "Failed to mark complete" });
    }
};

export const getPastChallenges = async (req, res) => {
    try {
        const userId = req.user.id;

        const participations = await ChallengeParticipant.find({ userId }).lean();
        const challengeIds = participations.map(p => p.challengeId);

        const expiredChallenges = await Challenge.find({
            _id: { $in: challengeIds },
            status: "expired"
        }).lean();

        const result = expiredChallenges.map(c => {
            const p = participations.find(p => p.challengeId.toString() === c._id.toString());
            return {
                ...c,
                completionPercentage: p ? p.completionPercentage : 0,
                isCompleted: p ? p.isCompleted : false,
                badgeAwarded: p ? p.badgeAwarded : false
            };
        });

        res.status(200).json({ challenges: result });
    } catch (error) {
        console.error("Error fetching past challenges:", error);
        res.status(500).json({ error: "Failed to fetch past challenges" });
    }
};

// ==================== CHALLENGE FEED ====================

export const getChallengeFeed = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const posts = await Post.find({ challengeId: id, isHidden: false })
            .populate("userId", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Post.countDocuments({ challengeId: id, isHidden: false });

        res.status(200).json({ posts, total, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        console.error("Error fetching challenge feed:", error);
        res.status(500).json({ error: "Failed to fetch feed" });
    }
};

export const createChallengeFeedPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { content } = req.body;

        const participant = await ChallengeParticipant.findOne({ userId, challengeId: id });
        if (!participant) return res.status(403).json({ error: "You must join this challenge to post" });

        const post = await Post.create({
            userId,
            challengeId: id,
            content: content.trim(),
            type: "challenge"
        });

        await post.populate("userId", "firstName lastName");

        res.status(201).json({ message: "Post created", post });
    } catch (error) {
        console.error("Error creating challenge post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};

export const reactToChallengeFeedPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const { emoji } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const existingReaction = post.reactions?.find(r => r.emoji === emoji);

        if (existingReaction) {
            const userIndex = existingReaction.userIds.indexOf(userId);
            if (userIndex > -1) {
                existingReaction.userIds.splice(userIndex, 1);
                existingReaction.count = existingReaction.userIds.length;
            } else {
                existingReaction.userIds.push(userId);
                existingReaction.count += 1;
            }
        } else {
            if (!post.reactions) post.reactions = [];
            post.reactions.push({ emoji, count: 1, userIds: [userId] });
        }

        await post.save();
        res.status(200).json({ message: "Reaction updated", reactions: post.reactions });
    } catch (error) {
        console.error("Error reacting to post:", error);
        res.status(500).json({ error: "Failed to react" });
    }
};