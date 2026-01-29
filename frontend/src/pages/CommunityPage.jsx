import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NotificationBell from '../components/NotificationBell';
import { Menu, Plus, Users, Trophy, MessageSquare, Filter } from 'lucide-react';
import { getPosts, getUserGroups, getUserChallenges } from "../services/communityService";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import GroupCard from "../components/GroupCard";
import ChallengeCard from "../components/ChallengeCard";

const CommunityPage = () => {
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState("feed"); // feed, groups, challenges
    const [posts, setPosts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);

    // Filters
    const [postCategory, setPostCategory] = useState("all");
    const [postType, setPostType] = useState("all");

    useEffect(() => {
        fetchData();
    }, [activeTab, postCategory, postType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "feed") {
                const data = await getPosts(1, 20, postCategory, postType);
                setPosts(data.posts || []);
            } else if (activeTab === "groups") {
                const data = await getUserGroups();
                setGroups(data.groups || []);
            } else if (activeTab === "challenges") {
                const data = await getUserChallenges();
                setChallenges(data.challenges || []);
            }
        } catch (error) {
            console.error("Error fetching community data:", error);
        } finally {
            setLoading(false);
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

    const categories = [
        { value: "all", label: "All", icon: "🌟" },
        { value: "wellbeing", label: "Wellbeing", icon: "💚" },
        { value: "habits", label: "Habits", icon: "✅" },
        { value: "journaling", label: "Journaling", icon: "📝" },
        { value: "gratitude", label: "Gratitude", icon: "🙏" },
        { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
        { value: "fitness", label: "Fitness", icon: "💪" },
        { value: "other", label: "Other", icon: "✨" }
    ];

    return (
        <>
            {showCreatePost && (
                <CreatePostModal
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={handlePostCreated}
                />
            )}

            <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
                {/* LEFT SIDEBAR */}
                <Sidebar />

                {/* MAIN CENTER PANEL */}
                <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-6"
                        style={{ fontFamily: "Brasika" }}>
                        <div>
                            <h1 className="text-3xl font-bold">
                                <span className="text-[#f4873e] dark:text-orange-400">Community </span>
                                <span className="text-green-900 dark:text-green-400">Space</span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Connect, share, and grow together
                            </p>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab("feed")}
                            className={`pb-3 px-4 flex items-center gap-2 font-semibold transition-all ${activeTab === "feed"
                                    ? "border-b-2 border-[#f4873e] text-[#f4873e] dark:text-orange-400"
                                    : "text-gray-600 dark:text-gray-400 hover:text-[#f4873e]"
                                }`}
                        >
                            <MessageSquare className="w-5 h-5" />
                            Community Feed
                        </button>

                        <button
                            onClick={() => setActiveTab("groups")}
                            className={`pb-3 px-4 flex items-center gap-2 font-semibold transition-all ${activeTab === "groups"
                                    ? "border-b-2 border-[#89beab] text-[#89beab] dark:text-teal-400"
                                    : "text-gray-600 dark:text-gray-400 hover:text-[#89beab]"
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            My Groups
                        </button>

                        <button
                            onClick={() => setActiveTab("challenges")}
                            className={`pb-3 px-4 flex items-center gap-2 font-semibold transition-all ${activeTab === "challenges"
                                    ? "border-b-2 border-[#f8ba90] text-[#f8ba90]"
                                    : "text-gray-600 dark:text-gray-400 hover:text-[#f8ba90]"
                                }`}
                        >
                            <Trophy className="w-5 h-5" />
                            Challenges
                        </button>
                    </div>

                    {/* FILTERS (only for feed) */}
                    {activeTab === "feed" && (
                        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => setPostCategory(cat.value)}
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all ${postCategory === cat.value
                                            ? "bg-[#f4873e] text-white shadow-md"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    <span>{cat.icon}</span>
                                    <span className="text-sm font-medium">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* CONTENT */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
                            </div>
                        ) : (
                            <>
                                {/* FEED TAB */}
                                {activeTab === "feed" && (
                                    <>
                                        {posts.length === 0 ? (
                                            <div className="text-center py-12">
                                                <MessageSquare className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                                    No posts yet. Be the first to share!
                                                </p>
                                            </div>
                                        ) : (
                                            posts.map(post => (
                                                <PostCard
                                                    key={post._id}
                                                    post={post}
                                                    onUpdate={handlePostUpdated}
                                                    onDelete={handlePostDeleted}
                                                />
                                            ))
                                        )}
                                    </>
                                )}

                                {/* GROUPS TAB */}
                                {activeTab === "groups" && (
                                    <>
                                        {groups.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Users className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                                                    You haven't joined any groups yet
                                                </p>
                                                <button
                                                    onClick={() => navigate('/community/groups/browse')}
                                                    className="bg-[#89beab] text-white px-6 py-2 rounded-full hover:bg-[#FFA669] transition-all"
                                                >
                                                    Browse Groups
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {groups.map(group => (
                                                    <GroupCard
                                                        key={group._id}
                                                        group={group}
                                                        onUpdate={fetchData}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* CHALLENGES TAB */}
                                {activeTab === "challenges" && (
                                    <>
                                        {challenges.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Trophy className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                                                    You're not participating in any challenges
                                                </p>
                                                <button
                                                    onClick={() => navigate('/community/challenges/browse')}
                                                    className="bg-[#f8ba90] text-white px-6 py-2 rounded-full hover:bg-[#f4873e] transition-all"
                                                >
                                                    Browse Challenges
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {challenges.map(challenge => (
                                                    <ChallengeCard
                                                        key={challenge._id}
                                                        challenge={challenge}
                                                        onUpdate={fetchData}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
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
                {activeTab === "feed" && (
                    <button
                        onClick={() => setShowCreatePost(true)}
                        className="absolute bottom-8 right-8 bg-[#89beab] dark:bg-teal-600 text-white p-5 rounded-full shadow-lg hover:bg-[#FFA669] dark:hover:bg-teal-700 hover:shadow-xl transition-all flex items-center gap-2 group"
                    >
                        <Plus className="w-6 h-6" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
                            New Post
                        </span>
                    </button>
                )}
            </div>
        </>
    );
};

export default CommunityPage;