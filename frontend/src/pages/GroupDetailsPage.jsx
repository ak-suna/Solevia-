import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NotificationBell from '../components/NotificationBell';
import { Menu, ArrowLeft, Users, CheckCircle, Plus, Calendar } from 'lucide-react';
import {
    getGroupById,
    getGroupPosts,
    leaveGroup,
    completeWeeklyTask
} from "../services/communityService";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import { jwtDecode } from "jwt-decode";

const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(false);

    // Get current user ID
    const token = localStorage.getItem("token");
    const currentUserId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    const fetchGroupData = async () => {
        setLoading(true);
        try {
            const groupData = await getGroupById(groupId);
            setGroup(groupData.group);

            // Check if user completed this week's task
            const completed = groupData.group.weeklyTask?.completedBy?.some(
                id => id === currentUserId
            );
            setTaskCompleted(completed);

            const postsData = await getGroupPosts(groupId);
            setPosts(postsData.posts || []);
        } catch (error) {
            console.error("Error fetching group data:", error);
            alert("Failed to load group. You may not have access.");
            navigate('/community');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveGroup = async () => {
        if (window.confirm("Are you sure you want to leave this group?")) {
            try {
                await leaveGroup(groupId);
                alert("You have left the group");
                navigate('/community');
            } catch (error) {
                console.error("Error leaving group:", error);
                alert("Failed to leave group");
            }
        }
    };

    const handleCompleteTask = async () => {
        try {
            await completeWeeklyTask(groupId);
            setTaskCompleted(true);
            alert("Great job! Weekly task completed! 🎉");
            fetchGroupData();
        } catch (error) {
            console.error("Error completing task:", error);
            alert(error.response?.data?.error || "Failed to complete task");
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
        setShowCreatePost(false);
    };

    const handlePostUpdated = (updatedPost) => {
        setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(p => p._id !== postId));
    };

    const categoryColors = {
        journaling: "from-purple-500 to-purple-600",
        gratitude: "from-yellow-500 to-yellow-600",
        mindfulness: "from-indigo-500 to-indigo-600",
        fitness: "from-red-500 to-red-600",
        habits: "from-blue-500 to-blue-600",
        goals: "from-green-500 to-green-600",
        wellness: "from-pink-500 to-pink-600",
        other: "from-gray-500 to-gray-600"
    };

    const gradientColor = categoryColors[group?.category] || categoryColors.other;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">Group not found</p>
            </div>
        );
    }

    return (
        <>
            {showCreatePost && (
                <CreatePostModal
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={handlePostCreated}
                    groupId={groupId}
                />
            )}

            <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
                {/* LEFT SIDEBAR */}
                <Sidebar />

                {/* MAIN CENTER PANEL */}
                <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/community')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#f4873e] mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Back to Community</span>
                    </button>

                    {/* Group Header */}
                    <div className={`bg-gradient-to-r ${gradientColor} rounded-3xl p-6 mb-6 text-white shadow-lg`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-5xl">{group.icon || "📝"}</div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Brasika" }}>
                                        {group.name}
                                    </h1>
                                    <p className="text-white/90 mb-3">
                                        {group.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>{group.memberCount || group.members?.length || 0} members</span>
                                        </div>
                                        <span className="px-3 py-1 bg-white/20 rounded-full">
                                            {group.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLeaveGroup}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition-colors"
                            >
                                Leave Group
                            </button>
                        </div>
                    </div>

                    {/* Weekly Task */}
                    {group.weeklyTask?.task && (
                        <div className="bg-gradient-to-br from-[#f8ba90] to-[#f4873e]/50 rounded-2xl p-6 mb-6 shadow-md">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-5 h-5 text-white" />
                                        <h3 className="text-lg font-bold text-white">This Week's Challenge</h3>
                                    </div>
                                    <p className="text-white/90 mb-4">
                                        {group.weeklyTask.task}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <Users className="w-4 h-4" />
                                        <span>
                                            {group.weeklyTask.completedBy?.length || 0} members completed
                                        </span>
                                    </div>
                                </div>
                                {!taskCompleted ? (
                                    <button
                                        onClick={handleCompleteTask}
                                        className="px-6 py-3 bg-white text-[#f4873e] rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md"
                                    >
                                        Mark Complete
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold shadow-md">
                                        <CheckCircle className="w-5 h-5" />
                                        Completed!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Group Feed */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Group Feed
                        </h2>

                        {posts.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    No posts yet. Be the first to share!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.map(post => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onUpdate={handlePostUpdated}
                                        onDelete={handlePostDeleted}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Right Navigation Buttons */}
                <div className="absolute top-6 right-6 flex items-center gap-6">
                    <NotificationBell />
                    <button
                        onClick={() => navigate('/settings')}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
                    >
                        <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* Create Post Button */}
                <button
                    onClick={() => setShowCreatePost(true)}
                    className="absolute bottom-8 right-8 bg-[#89beab] dark:bg-teal-600 text-white p-5 rounded-full shadow-lg hover:bg-[#FFA669] dark:hover:bg-teal-700 hover:shadow-xl transition-all flex items-center gap-2 group"
                >
                    <Plus className="w-6 h-6" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
                        New Post
                    </span>
                </button>
            </div>
        </>
    );
};

export default GroupDetailsPage;