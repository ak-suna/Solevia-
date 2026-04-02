import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Report } from "../models/Report.js";
import { Comment } from "../models/Comment.js";
import { Reaction } from "../models/Reaction.js";
import cloudinary from '../config/cloudinaryConfig.js';

// Create a new post
// Create a new post
export const createPost = async (req, res) => {
    try {
        const { content, type, category, tags, groupId } = req.body;
        const userId = req.user.id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: "Content is required" });
        }

        // Get image data from multer/cloudinary (if uploaded)
        let imageUrl = null;
        let imagePublicId = null;

        if (req.file) {
            imageUrl = req.file.path; // Cloudinary URL
            imagePublicId = req.file.filename; // Cloudinary public ID
        }

        const newPost = new Post({
            userId,
            content: content.trim(),
            type: type || "general",
            category: category || "other",
            image: imageUrl,
            imagePublicId: imagePublicId,
            tags: tags ? JSON.parse(tags) : [], // Parse tags from FormData
            groupId: groupId || null
        });

        await newPost.save();

        // Award points if post is in a group
        if (groupId) {
            await User.findByIdAndUpdate(userId, { $inc: { points: 5 } });
        }

        // Populate user info
        await newPost.populate('userId', 'firstName lastName');

        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};

// Get all posts (public feed) with comments and reactions from Comment/Reaction collections
export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, type } = req.query;

        const matchQuery = {
            isHidden: false,
            groupId: null
        };

        if (category && category !== "all") {
            matchQuery.category = category;
        }

        if (type && type !== "all") {
            matchQuery.type = type;
        }

        const pipeline = [
            { $match: matchQuery },
            { $sort: { isPinned: -1, createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit * 1 },
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userIdDoc", pipeline: [{ $project: { firstName: 1, lastName: 1 } }] } },
            { $unwind: { path: "$userIdDoc", preserveNullAndEmptyArrays: true } },
            { $set: { userId: "$userIdDoc" } },
            { $lookup: { from: "comments", let: { postId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$postId", "$$postId"] } } }, { $sort: { createdAt: 1 } }, { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "u", pipeline: [{ $project: { firstName: 1, lastName: 1 } }] } }, { $unwind: { path: "$u", preserveNullAndEmptyArrays: true } }, { $set: { userId: "$u" } }, { $project: { u: 0 } }], as: "comments" } },
            { $lookup: { from: "reactions", let: { postId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$postId", "$$postId"] } } }], as: "reactions" } },
            { $project: { userIdDoc: 0 } }
        ];

        const posts = await Post.aggregate(pipeline);
        const count = await Post.countDocuments(matchQuery);

        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

// Get single post by ID with comments and reactions
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const result = await Post.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(postId) } },
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userIdDoc", pipeline: [{ $project: { firstName: 1, lastName: 1 } }] } },
            { $unwind: { path: "$userIdDoc", preserveNullAndEmptyArrays: true } },
            { $set: { userId: "$userIdDoc" } },
            { $lookup: { from: "comments", let: { postId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$postId", "$$postId"] } } }, { $sort: { createdAt: 1 } }, { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "u", pipeline: [{ $project: { firstName: 1, lastName: 1 } }] } }, { $unwind: { path: "$u", preserveNullAndEmptyArrays: true } }, { $set: { userId: "$u" } }, { $project: { u: 0 } }], as: "comments" } },
            { $lookup: { from: "reactions", let: { postId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$postId", "$$postId"] } } }], as: "reactions" } },
            { $project: { userIdDoc: 0 } }
        ]);

        const post = result[0];
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.isHidden) {
            return res.status(403).json({ error: "This post is not available" });
        }

        res.status(200).json({ post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
};

// Get user's own posts
export const getUserPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const posts = await Post.find({ userId })
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Post.countDocuments({ userId });

        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

// Update post
export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, type, category, tags } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to edit this post" });
        }

        if (content) post.content = content.trim();
        if (type) post.type = type;
        if (category) post.category = category;
        if (tags) post.tags = tags;
        post.updatedAt = Date.now();

        await post.save();
        await post.populate('userId', 'firstName lastName');

        res.status(200).json({
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Failed to update post" });
    }
};

// Delete post
// Delete post
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Allow deletion if user owns the post OR if user is admin
        if (post.userId.toString() !== userId && userRole !== "admin") {
            return res.status(403).json({ error: "Not authorized to delete this post" });
        }

        // Delete image from Cloudinary if exists
        if (post.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(post.imagePublicId);
                console.log("Image deleted from Cloudinary:", post.imagePublicId);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
                // Continue with post deletion even if image deletion fails
            }
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

// Toggle reaction on post (uses Reaction model)
export const addReaction = async (req, res) => {
    try {
        const { postId } = req.params;
        const { emoji } = req.body;
        const userId = req.user.id;

        if (!emoji) {
            return res.status(400).json({ error: "Emoji is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const existingReaction = await Reaction.findOne({ postId, userId });


        let awardedPoints = false;
        if (existingReaction) {
            if (existingReaction.emoji === emoji) {
                await Reaction.findByIdAndDelete(existingReaction._id);
            } else {
                existingReaction.emoji = emoji;
                existingReaction.createdAt = Date.now();
                await existingReaction.save();
            }
        } else {
            await Reaction.create({ postId, userId, emoji });
            awardedPoints = true;
        }

        // Award points for new reaction (not for toggling off)
        if (awardedPoints) {
            await User.findByIdAndUpdate(userId, { $inc: { points: 2 } });
        }

        const updatedPost = await getPostByIdForResponse(postId);
        res.status(200).json({
            message: "Reaction updated",
            post: updatedPost
        });
    } catch (error) {
        console.error("Error adding reaction:", error);
        res.status(500).json({ error: "Failed to add reaction" });
    }
};

async function getPostByIdForResponse(postId) {
    const result = await Post.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(postId) } },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userIdDoc", pipeline: [{ $project: { firstName: 1, lastName: 1 } }] } },
        { $unwind: { path: "$userIdDoc", preserveNullAndEmptyArrays: true } },
        { $set: { userId: "$userIdDoc" } },
        { $lookup: { from: "comments", let: { postId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$postId", "$$postId"] } } }, { $sort: { createdAt: 1 } }, { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "u", pipeline: [{ $project: { firstName: 1, lastName: 1 } }] } }, { $unwind: { path: "$u", preserveNullAndEmptyArrays: true } }, { $set: { userId: "$u" } }, { $project: { u: 0 } }], as: "comments" } },
        { $lookup: { from: "reactions", let: { postId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$postId", "$$postId"] } } }], as: "reactions" } },
        { $project: { userIdDoc: 0 } }
    ]);
    return result[0] || null;
}

// Add comment to post (uses Comment model)
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const newComment = await Comment.create({
            postId,
            userId,
            content: content.trim()
        });
        await newComment.populate("userId", "firstName lastName");

        const updatedPost = await getPostByIdForResponse(postId);
        res.status(200).json({
            message: "Comment added successfully",
            post: updatedPost
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};

// Delete comment (uses Comment model; own comment only or admin)
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        if (comment.postId.toString() !== postId) {
            return res.status(400).json({ error: "Comment does not belong to this post" });
        }

        const canDelete = comment.userId.toString() === userId || userRole === "admin";
        if (!canDelete) {
            return res.status(403).json({ error: "Not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        const updatedPost = await getPostByIdForResponse(postId);
        res.status(200).json({ message: "Comment deleted successfully", post: updatedPost });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};

// Report a post
export const reportPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { reason, description } = req.body;
        const userId = req.user.id;

        if (!reason) {
            return res.status(400).json({ error: "Reason is required" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if user already reported this post
        const existingReport = await Report.findOne({
            reportedBy: userId,
            targetId: postId,
            reportType: "post"
        });

        if (existingReport) {
            return res.status(400).json({ error: "You have already reported this post" });
        }

        // Create report
        const report = new Report({
            reportedBy: userId,
            reportType: "post",
            targetId: postId,
            reason,
            description: description || ""
        });

        await report.save();

        // Update post report count
        post.reportCount += 1;
        post.isReported = true;
        await post.save();

        res.status(201).json({
            message: "Post reported successfully. Our team will review it.",
            report
        });
    } catch (error) {
        console.error("Error reporting post:", error);
        res.status(500).json({ error: "Failed to report post" });
    }
};

// Get posts by category (for filtered views)
export const getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const query = {
            isHidden: false,
            groupId: null,
            category
        };

        const posts = await Post.find(query)
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
            category
        });
    } catch (error) {
        console.error("Error fetching posts by category:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};