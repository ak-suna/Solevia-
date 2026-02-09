import { SupportGroup } from "../models/SupportGroup.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

// Get all support groups
export const getAllGroups = async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query;

        const query = { isActive: true };

        if (category && category !== "all") {
            query.category = category;
        }

        const groups = await SupportGroup.find(query)
            .populate('createdBy', 'firstName lastName')
            .sort({ memberCount: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await SupportGroup.countDocuments(query);

        res.status(200).json({
            groups,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: "Failed to fetch groups" });
    }
};

// Get single group by ID
export const getGroupById = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await SupportGroup.findById(groupId)
            .populate('createdBy', 'firstName lastName')
            .populate('members.userId', 'firstName lastName')
            .lean();

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.isActive) {
            return res.status(403).json({ error: "This group is not active" });
        }

        res.status(200).json({ group });
    } catch (error) {
        console.error("Error fetching group:", error);
        res.status(500).json({ error: "Failed to fetch group" });
    }
};

// Get user's joined groups
export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        const groups = await SupportGroup.find({
            'members.userId': userId,
            isActive: true
        })
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ groups });
    } catch (error) {
        console.error("Error fetching user groups:", error);
        res.status(500).json({ error: "Failed to fetch groups" });
    }
};

// Join a group
export const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.isActive) {
            return res.status(403).json({ error: "This group is not active" });
        }

        // Check if already a member
        const isMember = group.members.some(
            member => member.userId.toString() === userId
        );

        if (isMember) {
            return res.status(400).json({ error: "You are already a member of this group" });
        }

        // Check if group is full
        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({ error: "This group is full" });
        }

        group.members.push({ userId, role: "member" });
        await group.save();

        await group.populate('createdBy', 'firstName lastName');
        await group.populate('members.userId', 'firstName lastName');

        res.status(200).json({
            message: "Successfully joined the group",
            group
        });
    } catch (error) {
        console.error("Error joining group:", error);
        res.status(500).json({ error: "Failed to join group" });
    }
};

// Leave a group
export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is a member
        const memberIndex = group.members.findIndex(
            member => member.userId.toString() === userId
        );

        if (memberIndex === -1) {
            return res.status(400).json({ error: "You are not a member of this group" });
        }

        group.members.splice(memberIndex, 1);
        await group.save();

        res.status(200).json({ message: "Successfully left the group" });
    } catch (error) {
        console.error("Error leaving group:", error);
        res.status(500).json({ error: "Failed to leave group" });
    }
};

// Get group posts (group feed)
export const getGroupPosts = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.id;

        // Check if user is a member
        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const isMember = group.members.some(
            member => member.userId.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({ error: "You must be a member to view group posts" });
        }

        const posts = await Post.find({
            groupId,
            isHidden: false
        })
            .populate('userId', 'firstName lastName')
            .populate('comments.userId', 'firstName lastName')
            .sort({ isPinned: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Post.countDocuments({ groupId, isHidden: false });

        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error("Error fetching group posts:", error);
        res.status(500).json({ error: "Failed to fetch group posts" });
    }
};

// Complete weekly group task
export const completeWeeklyTask = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is a member
        const isMember = group.members.some(
            member => member.userId.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({ error: "You must be a member to complete tasks" });
        }

        // Check if already completed
        const alreadyCompleted = group.weeklyTask.completedBy.some(
            id => id.toString() === userId
        );

        if (alreadyCompleted) {
            return res.status(400).json({ error: "You have already completed this week's task" });
        }

        group.weeklyTask.completedBy.push(userId);
        await group.save();

        res.status(200).json({
            message: "Weekly task completed!",
            group
        });
    } catch (error) {
        console.error("Error completing weekly task:", error);
        res.status(500).json({ error: "Failed to complete task" });
    }
};

// Create a new group (admin only)
export const createGroup = async (req, res) => {
    try {
        const { name, description, category, icon, maxMembers } = req.body;
        const userId = req.user.id;

        if (!name || !description || !category) {
            return res.status(400).json({ error: "Name, description, and category are required" });
        }

        const newGroup = new SupportGroup({
            name: name.trim(),
            description: description.trim(),
            category,
            icon: icon || "📝",
            maxMembers: maxMembers || 50,
            createdBy: userId,
            moderators: [userId], // ✅ Admin is default moderator
            members: [{
                userId,
                role: "moderator" // ✅ Admin is moderator
            }]
        });

        await newGroup.save();
        await newGroup.populate('createdBy', 'firstName lastName');

        res.status(201).json({
            message: "Group created successfully",
            group: newGroup
        });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ error: "Failed to create group" });
    }
};

// Update group (admin/moderator only)
export const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, description, icon, weeklyTask } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is moderator or admin
        const member = group.members.find(m => m.userId.toString() === userId);
        const isModerator = member && member.role === "moderator";

        if (!isModerator && userRole !== "admin") {
            return res.status(403).json({ error: "Not authorized to update this group" });
        }

        if (name) group.name = name.trim();
        if (description) group.description = description.trim();
        if (icon) group.icon = icon;

        if (weeklyTask) {
            group.weeklyTask = {
                task: weeklyTask.task,
                week: weeklyTask.week || Date.now(),
                completedBy: []
            };
        }

        await group.save();
        await group.populate('createdBy', 'firstName lastName');

        res.status(200).json({
            message: "Group updated successfully",
            group
        });
    } catch (error) {
        console.error("Error updating group:", error);
        res.status(500).json({ error: "Failed to update group" });
    }
};

// Delete group (admin only)
export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Soft delete - mark as inactive
        group.isActive = false;
        await group.save();

        res.status(200).json({ message: "Group deactivated successfully" });
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ error: "Failed to delete group" });
    }
};

// Get recommended groups based on user's goals/habits (future enhancement)
export const getRecommendedGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        // For now, return popular groups
        // In future, can analyze user's goals/habits to recommend relevant groups
        const groups = await SupportGroup.find({ isActive: true })
            .populate('createdBy', 'firstName lastName')
            .sort({ memberCount: -1 })
            .limit(5)
            .lean();

        res.status(200).json({ groups });
    } catch (error) {
        console.error("Error fetching recommended groups:", error);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
};

export const requestToJoinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { message } = req.body;
        const userId = req.user.id;

        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.isActive) {
            return res.status(403).json({ error: "This group is not active" });
        }

        // Check if already a member
        const isMember = group.members.some(
            member => member.userId.toString() === userId
        );

        if (isMember) {
            return res.status(400).json({ error: "You are already a member of this group" });
        }

        // Check if group is full
        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({ error: "This group is full" });
        }

        // Check if already requested
        const existingRequest = group.joinRequests.find(
            req => req.userId.toString() === userId && req.status === 'pending'
        );

        if (existingRequest) {
            return res.status(400).json({ error: "You already have a pending request" });
        }

        // Add join request
        group.joinRequests.push({
            userId,
            message: message || "",
            status: 'pending',
            requestedAt: new Date()
        });

        await group.save();

        res.status(200).json({
            message: "Join request submitted successfully. Waiting for approval.",
            group: { _id: group._id, name: group.name }
        });
    } catch (error) {
        console.error("Error requesting to join group:", error);
        res.status(500).json({ error: "Failed to submit join request" });
    }
};

// Get pending join requests (admin or moderator)
export const getJoinRequests = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        const group = await SupportGroup.findById(groupId)
            .populate('joinRequests.userId', 'firstName lastName email');

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is admin or moderator of this group
        const isAdmin = req.user.role === 'admin';
        const isModerator = group.moderators.some(id => id.toString() === userId);

        if (!isAdmin && !isModerator) {
            return res.status(403).json({
                error: "Only admins and moderators can view join requests"
            });
        }

        // Get only pending requests
        const pendingRequests = group.joinRequests.filter(req => req.status === 'pending');

        res.status(200).json({
            group: { _id: group._id, name: group.name },
            requests: pendingRequests
        });
    } catch (error) {
        console.error("Error fetching join requests:", error);
        res.status(500).json({ error: "Failed to fetch join requests" });
    }
};

// Approve join request
export const approveJoinRequest = async (req, res) => {
    try {
        const { groupId, requestId } = req.params;
        const userId = req.user.id;

        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is admin or moderator
        const isAdmin = req.user.role === 'admin';
        const isModerator = group.moderators.some(id => id.toString() === userId);

        if (!isAdmin && !isModerator) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // Find the request
        const request = group.joinRequests.id(requestId);

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: "Request already processed" });
        }

        // Check if group is still not full
        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({ error: "Group is now full" });
        }

        // Add user to members
        group.members.push({
            userId: request.userId,
            joinedAt: new Date(),
            role: 'member'
        });

        // Update request status
        request.status = 'approved';
        request.reviewedBy = userId;
        request.reviewedAt = new Date();

        await group.save();

        res.status(200).json({
            message: "Join request approved successfully",
            group: { _id: group._id, name: group.name }
        });
    } catch (error) {
        console.error("Error approving request:", error);
        res.status(500).json({ error: "Failed to approve request" });
    }
};

// Reject join request
export const rejectJoinRequest = async (req, res) => {
    try {
        const { groupId, requestId } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;

        const group = await SupportGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check authorization
        const isAdmin = req.user.role === 'admin';
        const isModerator = group.moderators.some(id => id.toString() === userId);

        if (!isAdmin && !isModerator) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // Find request
        const request = group.joinRequests.id(requestId);

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: "Request already processed" });
        }

        // Update request
        request.status = 'rejected';
        request.reviewedBy = userId;
        request.reviewedAt = new Date();
        request.rejectionReason = reason || "Not specified";

        await group.save();

        res.status(200).json({
            message: "Join request rejected",
            group: { _id: group._id, name: group.name }
        });
    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ error: "Failed to reject request" });
    }
};

// ==================== MANUAL MODERATOR SELECTION ====================

// Get all members of a group (for manual selection)
export const getGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await SupportGroup.findById(groupId)
            .populate('members.userId', 'firstName lastName email');

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Only admin can view for moderator selection
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized" });
        }

        res.status(200).json({
            group: { _id: group._id, name: group.name },
            members: group.members
        });
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ error: "Failed to fetch members" });
    }
};
