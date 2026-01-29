import React from "react";
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const ChallengeCard = ({ challenge, onUpdate }) => {
    const navigate = useNavigate();

    const categoryColors = {
        habits: "bg-blue-500",
        gratitude: "bg-yellow-500",
        mindfulness: "bg-indigo-500",
        fitness: "bg-red-500",
        journaling: "bg-purple-500",
        wellness: "bg-pink-500",
        "digital-detox": "bg-gray-500",
        other: "bg-gray-500"
    };

    const color = categoryColors[challenge.category] || categoryColors.other;

    // Calculate progress for current user
    const userParticipant = challenge.participants?.find(
        p => p.userId === localStorage.getItem("userId") // You'd need to store this
    );

    const progress = userParticipant?.progress || 0;

    // Calculate days remaining
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div
            onClick={() => navigate(`/community/challenge/${challenge._id}`)}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-[#f4873e]"
        >
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                        {challenge.icon || "🎯"}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {challenge.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {challenge.duration} days • {challenge.category}
                        </p>
                    </div>
                </div>

                {challenge.isFeatured && (
                    <span className="px-2 py-1 bg-gradient-to-r from-[#f4873e] to-[#FFA669] text-white text-xs rounded-full font-bold shadow-md">
                        ⭐ Featured
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {challenge.description}
            </p>

            {/* Progress Bar (if user is participating) */}
            {userParticipant && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Your Progress
                        </span>
                        <span className="text-sm font-bold text-[#f4873e]">
                            {progress}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-[#f4873e] to-[#FFA669] h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <Users className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {challenge.participantCount || challenge.participants?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">participants</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {daysRemaining > 0 ? daysRemaining : 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">days left</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {challenge.completionRate || 0}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">completion</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span>Started: {formatDate(challenge.startDate)}</span>
                <span>•</span>
                <span>Ends: {formatDate(challenge.endDate)}</span>
            </div>

            {/* Reward Badge */}
            {challenge.rewards?.badge && (
                <div className="mt-4 flex items-center gap-2 p-2 bg-gradient-to-r from-[#f8ba90]/20 to-[#f4873e]/20 rounded-lg">
                    <Trophy className="w-4 h-4 text-[#f4873e]" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Reward: {challenge.rewards.badge}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ChallengeCard;