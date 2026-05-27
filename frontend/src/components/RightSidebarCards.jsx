
import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from '../components/NotificationBell';
import { Users, Trophy, TrendingUp, Clock, XCircle, Settings } from 'lucide-react';
import TrophyCard from "./TrophyCard";

const RightSidebarCards = ({
    myGroups = [],
    myChallenges = [],
    posts = [],
    challenges = [],
    pendingRequests = []
}) => {
    const navigate = useNavigate();

    return (
        <div className="w-80 flex flex-col gap-5 pt-20">
            {/* Top Navigation */}
            <div className="absolute top-6 right-6 flex items-center gap-4">
                <NotificationBell />
                <button
                    onClick={() => navigate('/settings')}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-700"
                >
                    <Settings className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* Card 1: Stats & Requests */}
            <div className="bg-[#f8ba90] dark:bg-gray-800 rounded-[40px] p-6 border-2 border-[#f8ba90] dark:border-blue-800 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-gray-700 dark:text-white" style={{ fontFamily: "Brasika" }}>
                        Quick Stats
                    </h3>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center">
                        <p className="text-2xl font-bold text-[#89beab]">{myGroups.length}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Groups</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center">
                        <p className="text-2xl font-bold text-[#f4873e]">{myChallenges.length}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Challenges</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{posts.length}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Posts</p>
                    </div>
                </div>
                {pendingRequests.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Requests</p>
                        {pendingRequests.map(request => (
                            <div
                                key={request.groupId}
                                className={`p-3 rounded-2xl ${request.status === 'pending'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                    : 'bg-red-100 dark:bg-red-900/30'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    {request.status === 'pending' ? (
                                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{request.groupName}</p>
                                        {request.status === 'pending' ? (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Sent {request.requestedAt}</p>
                                        ) : (
                                            <p className="text-xs text-red-600 dark:text-red-400">{request.reason}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Card 2: My Groups */}
            <div className="bg-[#89beab] dark:bg-gray-800 rounded-[40px] p-6 border-2 border-[#89beab] dark:border-teal-800 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-6 h-6 text-white" />
                    <h3 className="font-bold text-gray-800 dark:text-white" style={{ fontFamily: "Brasika" }}>
                        My Groups
                    </h3>
                </div>
                {myGroups.length > 0 ? (
                    <div className="space-y-3">
                        {myGroups.slice(0, 3).map(group => (
                            <div
                                key={group._id}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-md transition-all cursor-pointer"
                                onClick={() => navigate(`/community/group/${group._id}`)}
                            >
                                <span className="text-2xl">{group.icon || "📝"}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{group.name}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{group.members?.length || 0} members</p>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => navigate('/community/groups/browse')}
                            className="w-full py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full text-gray dark:text-gray-200 flex items-center justify-center gap-2"
                        >
                            View all Groups
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">No groups yet</p>
                        <button
                            onClick={() => navigate('/community/groups/browse')}
                            className="px-4 py-2 bg-gradient-to-r from-[#89beab] to-[#6fa893] text-white rounded-full font-bold hover:shadow-lg text-sm"
                        >
                            Explore Groups
                        </button>
                    </div>
                )}
            </div>

            {/* Card 3: Active Challenge */}
            {myChallenges.length > 0 && (
                <div className="bg-[#f9d9e3] dark:bg-gray-800 rounded-[40px] p-6 border-2 border-[#f9d9e3] dark:border-orange-800 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-6 h-6 text-[#f4873e]" />
                        <h3 className="font-bold text-gray-700 dark:text-white" style={{ fontFamily: "Brasika" }}>
                            Active Challenge
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{myChallenges[0].icon || "🏆"}</span>
                            <div className="flex-1">
                                <p className="font-bold text-gray-700 dark:text-gray-100">{myChallenges[0].title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Day {myChallenges[0].currentDay || 1} of {myChallenges[0].duration}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(Math.min(myChallenges[0].duration, 14))].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 flex-1 rounded-full ${i < (myChallenges[0].currentDay || 1)
                                        ? 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] dark:from-orange-700 dark:to-orange-900'
                                        : 'bg-white dark:bg-gray-800'
                                        }`}
                                ></div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/community/challenges/browse')}
                            className="w-full py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full text-gray dark:text-gray-200"
                        >
                            View All Challenges
                        </button>
                    </div>
                </div>
            )}
            
            {/* Card 4: Trophies */}
            <TrophyCard />
        </div>
    );
};

export default RightSidebarCards;