import { SupportGroup } from "../models/SupportGroup.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Report } from "../models/Report.js";

// ==================== CANDIDATE SCORING ====================

// Calculate member score for moderator candidacy
export const getMemberScore = async (userId, groupId) => {
    try {
        const group = await SupportGroup.findById(groupId);
        if (!group) {
            throw new Error("Group not found");
        }

        const member = group.members.find(m => m.userId.toString() === userId.toString());
        if (!member) {
            throw new Error("User is not a member of this group");
        }

        let score = 0;
        const metrics = {};

        // 1. Time in group (longer = more trustworthy)
        const daysInGroup = Math.floor((Date.now() - member.joinedAt) / (1000 * 60 * 60 * 24));
        metrics.daysInGroup = daysInGroup;

        if (daysInGroup > 30) score += 20;  // 1 month
        if (daysInGroup > 60) score += 20;  // 2 months
        if (daysInGroup > 90) score += 10;  // 3 months

        // 2. Weekly task completion
        const tasksCompleted = await countTasksCompleted(userId, groupId);
        metrics.tasksCompleted = tasksCompleted;
        score += tasksCompleted * 5; // 5 points per task

        // 3. Active participation (posts in group)
        const groupPosts = await Post.countDocuments({
            userId,
            groupId,
            isHidden: false
        });
        metrics.posts = groupPosts;
        score += Math.min(groupPosts * 3, 45); // Cap at 45 points (15 posts)

        // 4. Helpful comments/reactions
        const helpfulComments = await countHelpfulComments(userId, groupId);
        metrics.helpfulComments = helpfulComments;
        score += Math.min(helpfulComments * 2, 30); // Cap at 30 points

        // 5. No violations (negative score)
        const violations = await Report.countDocuments({
            targetId: userId,
            targetType: 'user',
            status: 'resolved',
            action: { $in: ['warning', 'content-removed', 'user-suspended'] }
        });
        metrics.violations = violations;
        score -= violations * 30; // Severe penalty

        // 6. Reports filed (helping moderate)
        const reportsFiledCount = await Report.countDocuments({
            reportedBy: userId,
            status: 'resolved'
        });
        metrics.reportsFiled = reportsFiledCount;
        score += Math.min(reportsFiledCount * 3, 15); // Cap at 15 points

        // Ensure score doesn't go negative
        score = Math.max(score, 0);

        return {
            userId,
            score,
            metrics,
            // CHANGED: from 50 to 25
            eligible: score >= 25 && daysInGroup >= 30 && violations === 0
        };
    } catch (error) {
        throw error;
    }
};

// Helper: Count tasks completed
const countTasksCompleted = async (userId, groupId) => {
    try {
        const group = await SupportGroup.findById(groupId);
        if (!group || !group.weeklyTask) return 0;

        // Count how many times user completed weekly tasks
        return group.weeklyTask.completedBy?.filter(
            id => id.toString() === userId.toString()
        ).length || 0;
    } catch (error) {
        return 0;
    }
};

// Helper: Count helpful comments
const countHelpfulComments = async (userId, groupId) => {
    try {
        const posts = await Post.find({ groupId, isHidden: false });

        let commentCount = 0;
        posts.forEach(post => {
            const userComments = post.comments.filter(
                c => c.userId.toString() === userId.toString()
            );
            commentCount += userComments.length;
        });

        return commentCount;
    } catch (error) {
        return 0;
    }
};

// ==================== GET CANDIDATES ====================

// Get top moderator candidates for a specific group
export const getModeratorCandidates = async (req, res) => {
    try {
        const { groupId } = req.params;
        const adminId = req.user.id;

        const group = await SupportGroup.findById(groupId).populate('members.userId', 'firstName lastName email');

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Only admin can view candidates
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Only admins can view candidates" });
        }

        // Score all members
        const candidates = [];

        for (const member of group.members) {
            // Skip if already a moderator
            if (member.role === 'moderator') continue;

            try {
                const scoreData = await getMemberScore(member.userId._id, groupId);

                candidates.push({
                    ...scoreData,
                    user: {
                        _id: member.userId._id,
                        firstName: member.userId.firstName,
                        lastName: member.userId.lastName,
                        email: member.userId.email
                    },
                    joinedAt: member.joinedAt
                });
            } catch (error) {
                console.error(`Error scoring user ${member.userId._id}:`, error);
            }
        }

        // Sort by score (highest first)
        candidates.sort((a, b) => b.score - a.score);

        res.status(200).json({
            group: {
                _id: group._id,
                name: group.name
            },
            candidates: candidates.slice(0, 10) // Top 10 candidates
        });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
};

// ==================== PROMOTION/DEMOTION ====================

// Promote user to moderator
export const promoteToModerator = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        const adminId = req.user.id;

        // Only admin can promote
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Only admins can promote moderators" });
        }

        const group = await SupportGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user is a member
        const member = group.members.find(m => m.userId.toString() === userId);
        if (!member) {
            return res.status(400).json({ error: "User is not a member of this group" });
        }

        // Check if already a moderator
        if (member.role === 'moderator') {
            return res.status(400).json({ error: "User is already a moderator" });
        }

        // Check score eligibility
        const scoreData = await getMemberScore(userId, groupId);
        if (!scoreData.eligible) {
            return res.status(400).json({
                error: "User does not meet minimum requirements",
                // CHANGED: from 50 to 25
                details: `Score: ${scoreData.score}/25 required, Days in group: ${scoreData.metrics.daysInGroup}/30 required`,
                scoreData
            });
        }
        // Promote to moderator
        member.role = 'moderator';

        // Add to group moderators array
        if (!group.moderators.includes(userId)) {
            group.moderators.push(userId);
        }

        await group.save();

        // Update user record
        user.role = 'moderator';
        if (!user.moderatedGroups.includes(groupId)) {
            user.moderatedGroups.push(groupId);
        }
        user.promotedBy = adminId;
        user.promotedAt = new Date();

        await user.save();

        // TODO: Send notification to user

        res.status(200).json({
            message: "User promoted to moderator successfully",
            group: {
                _id: group._id,
                name: group.name
            },
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error promoting moderator:", error);
        res.status(500).json({ error: "Failed to promote moderator" });
    }
};

// Remove moderator
export const removeModerator = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        // Only admin can remove
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Only admins can remove moderators" });
        }

        const group = await SupportGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find member and demote
        const member = group.members.find(m => m.userId.toString() === userId);
        if (member && member.role === 'moderator') {
            member.role = 'member';
        }

        // Remove from moderators array
        group.moderators = group.moderators.filter(id => id.toString() !== userId);
        await group.save();

        // Update user
        user.moderatedGroups = user.moderatedGroups.filter(id => id.toString() !== groupId);

        // If user doesn't moderate any other groups, demote to regular user
        if (user.moderatedGroups.length === 0 && user.role === 'moderator') {
            user.role = 'user';
        }

        await user.save();

        res.status(200).json({
            message: "Moderator removed successfully"
        });
    } catch (error) {
        console.error("Error removing moderator:", error);
        res.status(500).json({ error: "Failed to remove moderator" });
    }
};

// ==================== GET MODERATED GROUPS ====================

// Get groups moderated by current user
export const getModeratedGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        const groups = await SupportGroup.find({
            moderators: userId,
            isActive: true
        })
            .populate('createdBy', 'firstName lastName')
            .populate('joinRequests.userId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.status(200).json({ groups });
    } catch (error) {
        console.error("Error fetching moderated groups:", error);
        res.status(500).json({ error: "Failed to fetch moderated groups" });
    }
};