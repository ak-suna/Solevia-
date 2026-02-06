import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users, Calendar, ArrowLeft } from 'lucide-react';
import { getAllGroups, joinGroup } from "../services/communityService";
import Sidebar from "../components/Sidebar";
import NotificationBell from '../components/NotificationBell';
import { Menu } from 'lucide-react';

const BrowseGroupsPage = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, journaling, gratitude, etc.

    useEffect(() => {
        fetchGroups();
    }, [filter]);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const params = filter === "all" ? {} : { category: filter };
            const data = await getAllGroups({ ...params, limit: 50 });
            setGroups(data.groups || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
            alert("Failed to load groups");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            await joinGroup(groupId);
            alert("Successfully joined group!");
            fetchGroups(); // Refresh to show updated member count
        } catch (error) {
            console.error("Error joining group:", error);
            alert(error.response?.data?.error || "Failed to join group");
        }
    };

    const categoryIcons = {
        journaling: "📝",
        gratitude: "🙏",
        mindfulness: "🧘",
        fitness: "💪",
        habits: "✅",
        goals: "🎯",
        wellness: "💚",
        other: "✨"
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

    const categories = [
        { id: "all", label: "All Groups" },
        { id: "journaling", label: "Journaling" },
        { id: "gratitude", label: "Gratitude" },
        { id: "mindfulness", label: "Mindfulness" },
        { id: "fitness", label: "Fitness" },
        { id: "habits", label: "Habits" },
        { id: "goals", label: "Goals" },
        { id: "wellness", label: "Wellness" }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CENTER PANEL */}
            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#89beab] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to Community</span>
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Brasika" }}>
                        <span className="text-[#89beab] dark:text-teal-400">Support </span>
                        <span className="text-[#f4873e] dark:text-orange-400">Groups</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Join groups to connect with others on similar journeys
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setFilter(category.id)}
                            className={`
                                px-4 py-2 rounded-full font-bold transition-all text-sm
                                ${filter === category.id
                                    ? 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                                }
                            `}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
                    </div>
                ) : groups.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No groups available yet
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                            Check back later for new groups!
                        </p>
                    </div>
                ) : (
                    /* Groups Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groups.map(group => {
                            const isFull = group.memberCount >= group.maxMembers;
                            return (
                                <div
                                    key={group._id}
                                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all"
                                >
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-4xl">{group.icon || categoryIcons[group.category]}</span>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                                {group.name}
                                            </h3>
                                            <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[group.category]} text-white rounded-full text-xs font-bold`}>
                                                {group.category}
                                            </span>
                                        </div>
                                        {isFull && (
                                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold">
                                                Full
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                        {group.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{group.memberCount || group.members?.length || 0}</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Users className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Capacity</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{group.maxMembers}</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <div className={`w-4 h-4 mx-auto mb-1 rounded-full ${group.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                                            <p className={`font-bold text-xs ${group.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {group.isActive ? "Active" : "Inactive"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Weekly Task */}
                                    {group.weeklyTask?.task && (
                                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-4 mb-4">
                                            <div className="flex items-start gap-2">
                                                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-1" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-orange-900 dark:text-orange-300 mb-1">This Week's Task</p>
                                                    <p className="text-sm text-orange-800 dark:text-orange-200">{group.weeklyTask.task}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Join Button */}
                                    <button
                                        onClick={() => handleJoinGroup(group._id)}
                                        disabled={isFull || !group.isActive}
                                        className={`
                                            w-full py-3 rounded-full font-bold transition-all
                                            ${isFull || !group.isActive
                                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white hover:shadow-lg'
                                            }
                                        `}
                                    >
                                        {isFull ? "Group Full" : !group.isActive ? "Group Inactive" : "Join Group"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
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
        </div>
    );
};

export default BrowseGroupsPage;