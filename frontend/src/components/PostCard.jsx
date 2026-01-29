import React, { useState } from "react";
import { Heart, MessageCircle, MoreVertical, Flag, Trash2, Edit, Send } from 'lucide-react';
import { addReaction, addComment, deletePost, deleteComment } from "../services/communityService";
import { jwtDecode } from "jwt-decode";
import ReportModal from "./ReportModal";

const PostCard = ({ post, onUpdate, onDelete }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

    // Get current user ID from token
    const token = localStorage.getItem("token");
    const currentUserId = token ? jwtDecode(token).id : null;
    const isOwnPost = post.userId?._id === currentUserId;

    // Category colors and icons
    const categoryStyles = {
        wellbeing: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-700 dark:text-green-300", icon: "💚" },
        habits: { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-700 dark:text-blue-300", icon: "✅" },
        journaling: { bg: "bg-purple-100 dark:bg-purple-900", text: "text-purple-700 dark:text-purple-300", icon: "📝" },
        gratitude: { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-700 dark:text-yellow-300", icon: "🙏" },
        mindfulness: { bg: "bg-indigo-100 dark:bg-indigo-900", text: "text-indigo-700 dark:text-indigo-300", icon: "🧘" },
        fitness: { bg: "bg-red-100 dark:bg-red-900", text: "text-red-700 dark:text-red-300", icon: "💪" },
        other: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-700 dark:text-gray-300", icon: "✨" }
    };

    const categoryStyle = categoryStyles[post.category] || categoryStyles.other;

    const handleReaction = async (emoji) => {
        try {
            const result = await addReaction(post._id, emoji);
            onUpdate(result.post);
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        setSubmittingComment(true);
        try {
            const result = await addComment(post._id, commentText);
            onUpdate(result.post);
            setCommentText("");
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(post._id);
                onDelete(post._id);
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(post._id, commentId);
                // Refresh post data
                const updatedPost = { ...post };
                updatedPost.comments = updatedPost.comments.filter(c => c._id !== commentId);
                onUpdate(updatedPost);
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    // Check if current user has reacted
    const userReaction = post.reactions?.find(r => r.userId === currentUserId);

    // Get reaction counts
    const reactionCounts = {};
    post.reactions?.forEach(r => {
        reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {showReportModal && (
                <ReportModal
                    targetId={post._id}
                    targetType="post"
                    onClose={() => setShowReportModal(false)}
                />
            )}

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-600">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f4873e] to-[#89beab] flex items-center justify-center text-white font-bold">
                            {post.userId?.firstName?.[0]}{post.userId?.lastName?.[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {post.userId?.firstName} {post.userId?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {showOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                {isOwnPost ? (
                                    <>
                                        <button
                                            onClick={handleDeletePost}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Post
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowReportModal(true);
                                            setShowOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Report Post
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                        <span>{categoryStyle.icon}</span>
                        {post.category}
                    </span>
                </div>

                {/* Content */}
                <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                    {post.content}
                </p>

                {/* Image if exists */}
                {post.image && (
                    <img
                        src={post.image}
                        alt="Post content"
                        className="w-full rounded-lg mb-4 max-h-96 object-cover"
                    />
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Reactions Display */}
                {Object.keys(reactionCounts).length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {Object.entries(reactionCounts).map(([emoji, count]) => (
                            <span
                                key={emoji}
                                className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full flex items-center gap-1"
                            >
                                {emoji} {count}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-200 dark:border-gray-600">
                    {/* React */}
                    <div className="flex gap-1">
                        {['👍', '❤️', '🎉', '💪', '🙏'].map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => handleReaction(emoji)}
                                className={`text-lg hover:scale-125 transition-transform ${userReaction?.emoji === emoji ? 'scale-125' : ''
                                    }`}
                                title={`React with ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    {/* Comment */}
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#89beab] transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        {/* Add Comment */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#89beab]"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={submittingComment || !commentText.trim()}
                                className="p-2 rounded-full bg-[#89beab] text-white hover:bg-[#f4873e] transition-colors disabled:opacity-50"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3">
                            {post.comments?.map(comment => (
                                <div key={comment._id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#89beab] to-[#f4873e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {comment.userId?.firstName?.[0]}{comment.userId?.lastName?.[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3">
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                                {comment.userId?.firstName} {comment.userId?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                                {comment.content}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 px-3">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                            {comment.userId?._id === currentUserId && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PostCard;