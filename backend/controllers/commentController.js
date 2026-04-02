import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";

// Get comments by post ID
export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comments = await Comment.find({ postId })
            .populate("userId", "firstName lastName")
            .sort({ createdAt: 1 })
            .lean();

        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};

// Add comment to a post
export const addComment = async (req, res) => {
    try {
        const { postId } = req.body;
        const { content } = req.body;
        const userId = req.user.id;

        if (!postId || !content || content.trim().length === 0) {
            return res.status(400).json({ error: "Post ID and comment content are required" });
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

        // Award points for commenting in a group post
        if (post.groupId) {
            await User.findByIdAndUpdate(userId, { $inc: { points: 2 } });
        }

        res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};

// Delete own comment
export const deleteOwnComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};
