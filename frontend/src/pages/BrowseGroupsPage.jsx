import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import RightSidebarCards from "../components/RightSidebarCards";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { getAllGroups, requestToJoinGroup, getUserGroups, getUserChallenges } from "../services/communityService";

const BrowseGroupsPage = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [myChallenges, setMyChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [requesting, setRequesting] = useState(null);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinReason, setJoinReason] = useState("");
    const [pendingGroup, setPendingGroup] = useState(null); // { id, name }
    const [toast, setToast] = useState(null); // { message, type }

    useEffect(() => {
        fetchData();
    }, [categoryFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllGroups(categoryFilter);
            setGroups(data.groups || []);

            // Fetch user's data for right cards
            const myGroupsData = await getUserGroups();
            setMyGroups(myGroupsData.groups || []);

            const challengesData = await getUserChallenges();
            setMyChallenges(challengesData.challenges || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
            setToast({ message: "Failed to load groups", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const openJoinModal = (groupId, groupName) => {
        setPendingGroup({ id: groupId, name: groupName });
        setJoinReason("");
        setShowJoinModal(true);
    };

    const handleSubmitJoinRequest = async () => {
        if (!pendingGroup) return;
        setRequesting(pendingGroup.id);
        setShowJoinModal(false);
        try {
            await requestToJoinGroup(pendingGroup.id, joinReason);
            setToast({ message: `✓ Join request submitted for "${pendingGroup.name}"! A moderator will review your request soon.`, type: "success" });
            fetchData();
        } catch (error) {
            setToast({ message: error.message || "Failed to submit join request", type: "error" });
        } finally {
            setRequesting(null);
            setPendingGroup(null);
        }
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

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6">
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CENTER PANEL - Matches dashboard width */}
            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] max-h-[775px] overflow-y-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#f4873e] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to Group</span>
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Brasika" }}>
                        <span className="text-[#89beab] dark:text-teal-400">Browse </span>
                        <span className="text-[#f4873e] dark:text-orange-400">Groups</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Find a supportive community to join your wellness journey!
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Category
                    </label>
                    <div className="flex gap-3 flex-wrap">
                        {["all", "journaling", "gratitude", "mindfulness", "fitness", "habits", "goals", "wellness", "other"].map(category => (
                            <button
                                key={category}
                                onClick={() => setCategoryFilter(category)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-semibold transition-all
                                    ${categoryFilter === category
                                        ? 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                                    }
                                `}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89beab]"></div>
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No groups found. Check back later!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groups.map(group => {
                            const isMember = myGroups.some(g => g._id === group._id);
                            const isFull = group.members?.length >= group.maxMembers;

                            return (
                                <div
                                    key={group._id}
                                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl hover:border-[#89beab] dark:hover:border-teal-500 transition-all cursor-pointer"
                                    onClick={() => navigate(`/community/group/${group._id}`)}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${categoryColors[group.category] || 'from-gray-500 to-gray-600'} rounded-2xl flex items-center justify-center text-3xl shadow-md`}>
                                            {group.icon || "📝"}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                                                {group.name}
                                            </h3>
                                            <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryColors[group.category]} text-white rounded-full text-xs font-bold`}>
                                                {group.category}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {group.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Users className="w-4 h-4 mx-auto mb-1 text-[#89beab]" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Members</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {group.members?.length || 0} / {group.maxMembers}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-600 rounded-2xl p-3 text-center">
                                            <Calendar className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Weekly Task</p>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                {group.weeklyTask?.task ? '✓ Active' : 'None'}
                                            </p>
                                        </div>
                                    </div>

                                    {group.weeklyTask?.task && (
                                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-3 mb-4">
                                            <div className="flex items-start gap-2">
                                                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-orange-900 dark:text-orange-300 mb-1">This Week's Task</p>
                                                    <p className="text-sm text-orange-800 dark:text-orange-200 line-clamp-1">
                                                        {group.weeklyTask.task}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isMember && !isFull) {
                                                openJoinModal(group._id, group.name);
                                            }
                                        }}
                                        disabled={isMember || isFull || requesting === group._id}
                                        className={`
                                            w-full py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2
                                            ${isMember
                                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                                                : isFull
                                                    ? 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white hover:shadow-lg'
                                            }
                                        `}
                                    >
                                        {requesting === group._id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Sending Request...
                                            </>
                                        ) : isMember ? (
                                            <>✓ Joined</>
                                        ) : isFull ? (
                                            <>Full</>
                                        ) : (
                                            <>
                                                <Users className="w-4 h-4" />
                                                Request to Join
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Join Request Modal */}
            <Modal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                title={`Request to join "${pendingGroup?.name || ''}"`}
            >
                <label className="block text-sm font-semibold mb-2">Why do you want to join? (optional)</label>
                <textarea
                    className="w-full min-h-[80px] rounded-lg border border-gray-300 dark:border-gray-600 p-2 mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={joinReason}
                    onChange={e => setJoinReason(e.target.value)}
                    placeholder="Tell the moderators why you'd like to join..."
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500"
                        onClick={() => setShowJoinModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white font-bold hover:shadow-lg"
                        onClick={handleSubmitJoinRequest}
                        disabled={requesting}
                    >
                        {requesting ? "Sending..." : "Submit Request"}
                    </button>
                </div>
            </Modal>

            {/* Toast Notification */}
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

            {/* RIGHT SIDEBAR CARDS - Reusable Component */}
            <RightSidebarCards
                myGroups={myGroups}
                myChallenges={myChallenges}
                posts={[]}
                challenges={groups}
                pendingRequests={[]}
            />
        </div>
    );
};

export default BrowseGroupsPage;