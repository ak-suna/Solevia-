import { Reaction } from "../models/Reaction.js";
import { Post } from "../models/Post.js";
import mongoose from "mongoose";
import notificationService from "../services/notificationService.js";

// Helper to get post with comments and reactions for response
async function getPostWithCommentsAndReactions(postId) {
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

// Toggle reaction (like) on a post
export const toggleReaction = async (req, res) => {
    try {
        const { postId, emoji } = req.body;
        const userId = req.user.id;

        if (!postId || !emoji) {
            return res.status(400).json({ error: "Post ID and emoji are required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const existingReaction = await Reaction.findOne({ postId, userId });

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
            
            if (post.userId.toString() !== userId.toString()) {
                await notificationService.createNotification({
                    userId: post.userId,
                    type: "COMMUNITY_LIKE",
                    title: "Someone liked your post",
                    message: `Your post received a new like`,
                    data: { postId: post._id, actionUrl: "/community" }
                });
            }
        }

        const updatedPost = await getPostWithCommentsAndReactions(postId);
        res.status(200).json({
            message: "Reaction updated",
            post: updatedPost
        });
    } catch (error) {
        console.error("Error toggling reaction:", error);
        res.status(500).json({ error: "Failed to toggle reaction" });
    }
};
