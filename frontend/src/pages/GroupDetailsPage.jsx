import React, { useState, useEffect } from "react";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import ModeratorCandidatesModal from "../components/ModeratorCandidatesModal";
import WeeklyTaskModal from "../components/WeeklyTaskModal";
import { jwtDecode } from "jwt-decode";

const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [showCreatePost, setShowCreatePost] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(false);

    // Get current user ID
    const token = localStorage.getItem("token");
    const currentUserId = token ? jwtDecode(token).id : null;

    const { data: groupData, isLoading: loadingGroup, isError: groupError } = useQuery({
        queryKey: ["community", "group", groupId],
        queryFn: () => getGroupById(groupId),
        enabled: !!groupId,
        refetchInterval: 5000,
    });

    const { data: postsData } = useQuery({
        queryKey: ["community", "groupPosts", groupId],
        queryFn: () => getGroupPosts(groupId),
        enabled: !!groupId,
        refetchInterval: 5000,
    });

    const group = groupData?.group ?? null;
    const posts = postsData?.posts ?? [];
    const loading = loadingGroup;

    // Modal/Toast state
    const [modal, setModal] = useState({ open: false, type: '', message: '', onConfirm: null });
    const [toast, setToast] = useState(null);

    // Weekly Task Modal state
    const [showWeeklyTaskModal, setShowWeeklyTaskModal] = useState(false);

    // Block disabled users from accessing the group
    useEffect(() => {
        if (groupError && groupData === undefined && groupError.response && groupError.response.data && groupError.response.data.error) {
            setModal({ open: true, type: 'error', message: groupError.response.data.error, onConfirm: () => window.location.href = '/' });
        }
    }, [groupError, groupData]);


    // Sync task completed from group data (must match userId as string)
    useEffect(() => {
        if (group?.weeklyTask?.completedBy?.some(entry => entry.userId === currentUserId || entry.userId?._id === currentUserId)) {
            setTaskCompleted(true);
        } else {
            setTaskCompleted(false);
        }
    }, [group, currentUserId]);

    // Modal for assigning moderator
    const [showModeratorModal, setShowModeratorModal] = useState(false);

    useEffect(() => {
        if (groupError) {
            setModal({ open: true, type: 'error', message: 'Failed to load group. You may not have access.', onConfirm: () => { setModal({ ...modal, open: false }); navigate('/community'); } });
        }
        // eslint-disable-next-line
    }, [groupError, navigate]);

    // Helper: is current user a member and not disabled?
    const memberObj = group?.members?.find(m => m.userId === currentUserId || m.userId?._id === currentUserId);
    const isMember = !!memberObj && !memberObj.disabled;
    const isDisabled = !!memberObj && memberObj.disabled;
    // Helper: is current user a moderator (by moderatorId or member role)
    const isModerator = (group?.moderatorId && (group.moderatorId === currentUserId || group.moderatorId?._id === currentUserId)) ||
        group?.members?.some(m => (m.userId === currentUserId || m.userId?._id === currentUserId) && m.role === "moderator");
    // Save weekly task handler
    const handleSaveWeeklyTask = async (task) => {
        try {
            // Call backend API to update weekly task
            await fetch(`/api/groups/${groupId}/weekly-task`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ task })
            });
            // Invalidate and refetch group data to ensure latest task is shown
            await queryClient.invalidateQueries({ queryKey: ["community", "group", groupId] });
            setShowWeeklyTaskModal(false);
            setToast({ message: 'Weekly task updated!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to update weekly task', type: 'error' });
        }
    };

    const handleLeaveGroup = () => {
        setModal({
            open: true,
            type: 'confirm',
            message: 'Are you sure you want to leave this group?',
            onConfirm: async () => {
                setModal({ ...modal, open: false });
                try {
                    await leaveGroup(groupId);
                    setToast({ message: 'You have left the group', type: 'success' });
                    navigate('/community');
                } catch (error) {
                    setToast({ message: 'Failed to leave group', type: 'error' });
                }
            }
        });
    };


    const handleCompleteTask = async () => {
        try {
            const res = await completeWeeklyTask(groupId);
            setTaskCompleted(true);
            setToast({ message: 'Great job! Weekly task completed! 🎉', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ["community", "group", groupId] });
        } catch (error) {
            setToast({ message: error.message || 'Failed to complete task', type: 'error' });
        }
    };

    const handlePostCreated = () => {
        setShowCreatePost(false);
        queryClient.invalidateQueries({ queryKey: ["community"] });
    };

    const handlePostUpdated = (updatedPost) => {
        queryClient.setQueryData(["community", "groupPosts", groupId], (prev) =>
            prev ? { ...prev, posts: prev.posts.map(p => p._id === updatedPost._id ? updatedPost : p) } : prev
        );
    };

    const handlePostDeleted = (postId) => {
        queryClient.setQueryData(["community", "groupPosts", groupId], (prev) =>
            prev ? { ...prev, posts: prev.posts.filter(p => p._id !== postId) } : prev
        );
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
                {/* Toast notification */}
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type === "error" ? "error" : "success"}
                            onClose={() => setToast(null)}
                            duration={3000}
                        />
                    )}
                </div>
            </div>
        );
    }

    // If not a member, show access denied
    if (!isMember && !isDisabled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl text-center max-w-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">You must be a member of this group to view its content.</p>
                    <button
                        onClick={() => navigate('/community')}
                        className="px-6 py-3 bg-[#f4873e] text-white rounded-full font-bold hover:bg-[#ffa669] transition-colors"
                    >
                        Back to Community
                    </button>
                </div>
                {/* Toast notification */}
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type === "error" ? "error" : "success"}
                            onClose={() => setToast(null)}
                            duration={3000}
                        />
                    )}
                </div>
            </div>
        );
    }
    // If disabled, show disabled message
    if (isDisabled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl text-center max-w-lg">
                    <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">You are disabled from this group</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{memberObj.disabledReason || 'You have been disabled by a moderator and cannot access this group.'}</p>
                    <button
                        onClick={() => navigate('/community')}
                        className="px-6 py-3 bg-[#f4873e] text-white rounded-full font-bold hover:bg-[#ffa669] transition-colors"
                    >
                        Back to Community
                    </button>
                </div>
                {/* Toast notification */}
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type === "error" ? "error" : "success"}
                            onClose={() => setToast(null)}
                            duration={3000}
                        />
                    )}
                </div>
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
            {showModeratorModal && (
                <ModeratorCandidatesModal
                    groupId={groupId}
                    groupName={group?.name}
                    onClose={() => setShowModeratorModal(false)}
                    onSuccess={() => {
                        setShowModeratorModal(false);
                        queryClient.invalidateQueries({ queryKey: ["community", "group", groupId] });
                    }}
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
                                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" style={{ fontFamily: "Brasika" }}>
                                        {group.name}
                                        {/* 👑 badge for moderator */}
                                        {group.moderatorId && (group.moderatorId === currentUserId || group.moderatorId?._id === currentUserId) && (
                                            <span title="You are the moderator" className="ml-2 text-yellow-400 text-2xl">👑</span>
                                        )}
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
                            <div className="flex flex-col gap-2 items-end">
                                <button
                                    onClick={handleLeaveGroup}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition-colors"
                                >
                                    Leave Group
                                </button>
                                {/* Show Assign Moderator button for admin only */}
                                {group && group.adminId === currentUserId && (
                                    <button
                                        onClick={() => setShowModeratorModal(true)}
                                        className="px-4 py-2 bg-[#89beab] hover:bg-[#6fa893] text-white rounded-full text-sm font-semibold transition-colors mt-2"
                                    >
                                        Assign Moderator
                                    </button>
                                )}
                                {/* Show Set Weekly Task button for admin or moderator */}
                                {group && (group.adminId === currentUserId || isModerator) && (
                                    <button
                                        onClick={() => setShowWeeklyTaskModal(true)}
                                        className="px-4 py-2 bg-[#f4873e] hover:bg-[#f8ba90] text-white rounded-full text-sm font-semibold transition-colors mt-2"
                                    >
                                        Set Weekly Task
                                    </button>
                                )}
                                {/* Show Moderator Tools button for admin or moderator */}
                                {group && (group.adminId === currentUserId || isModerator) && (
                                    <button
                                        onClick={() => navigate(`/groups/${group._id}/moderator/dashboard`)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition-colors mt-2"
                                    >
                                        Moderator Tools
                                    </button>
                                )}
                            </div>
                            {/* Weekly Task Modal */}
                            <WeeklyTaskModal
                                isOpen={showWeeklyTaskModal}
                                onClose={() => setShowWeeklyTaskModal(false)}
                                onSave={handleSaveWeeklyTask}
                                initialTask={group?.weeklyTask?.task || ''}
                            />
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
                                            {/* Show X/Y members completed · Z% */}
                                            {(() => {
                                                const completed = group.weeklyTask.completedBy?.length || 0;
                                                const total = group.memberCount || group.members?.length || 0;
                                                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                                                return `${completed}/${total} members completed · ${percent}%`;
                                            })()}
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

            {/* Modal Dialogs */}
            <Modal
                isOpen={modal.open}
                onClose={() => setModal({ ...modal, open: false })}
                title={modal.type === 'confirm' ? 'Confirm' : modal.type === 'error' ? 'Error' : ''}
            >
                <p className="mb-4">{modal.message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500"
                        onClick={() => setModal({ ...modal, open: false })}
                    >
                        Cancel
                    </button>
                    {modal.type === 'confirm' && (
                        <button
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:shadow-lg"
                            onClick={modal.onConfirm}
                        >
                            Confirm
                        </button>
                    )}
                    {modal.type === 'error' && (
                        <button
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg"
                            onClick={modal.onConfirm}
                        >
                            OK
                        </button>
                    )}
                </div>
            </Modal>

            {/* Toast notification */}
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type === "error" ? "error" : "success"}
                        onClose={() => setToast(null)}
                        duration={3000}
                    />
                )}
            </div>
        </>
    );
};

export default GroupDetailsPage;