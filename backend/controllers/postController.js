import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Report } from "../models/Report.js";

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { content, type, category, image, tags, groupId } = req.body;
        const userId = req.user.id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: "Content is required" });
        }

        const newPost = new Post({
            userId,
            content: content.trim(),
            type: type || "general",
            category: category || "other",
            image,
            tags: tags || [],
            groupId: groupId || null
        });

        await newPost.save();

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

// Get all posts (public feed)
export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, type } = req.query;

        const query = {
            isHidden: false,
            groupId: null // only public posts
        };

        if (category && category !== "all") {
            query.category = category;
        }

        if (type && type !== "all") {
            query.type = type;
        }

        const posts = await Post.find(query)
            .populate('userId', 'firstName lastName')
            .populate('comments.userId', 'firstName lastName')
            .sort({ isPinned: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Post.countDocuments(query);

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

// Get single post by ID
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId)
            .populate('userId', 'firstName lastName')
            .populate('comments.userId', 'firstName lastName')
            .lean();

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

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

// Add reaction to post
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

        // Check if user already reacted
        const existingReaction = post.reactions.find(
            r => r.userId.toString() === userId
        );

        if (existingReaction) {
            // Update emoji if different
            if (existingReaction.emoji !== emoji) {
                existingReaction.emoji = emoji;
                existingReaction.createdAt = Date.now();
            } else {
                // Remove reaction if same emoji
                post.reactions = post.reactions.filter(
                    r => r.userId.toString() !== userId
                );
            }
        } else {
            // Add new reaction
            post.reactions.push({ userId, emoji });
        }

        await post.save();
        await post.populate('userId', 'firstName lastName');

        res.status(200).json({
            message: "Reaction updated",
            post
        });
    } catch (error) {
        console.error("Error adding reaction:", error);
        res.status(500).json({ error: "Failed to add reaction" });
    }
};

// Add comment to post
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

        post.comments.push({
            userId,
            content: content.trim()
        });

        await post.save();
        await post.populate('userId', 'firstName lastName');
        await post.populate('comments.userId', 'firstName lastName');

        res.status(200).json({
            message: "Comment added successfully",
            post
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};

// Delete comment
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Allow deletion if user owns the comment, owns the post, OR is admin
        if (
            comment.userId.toString() !== userId &&
            post.userId.toString() !== userId &&
            userRole !== "admin"
        ) {
            return res.status(403).json({ error: "Not authorized to delete this comment" });
        }

        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });
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