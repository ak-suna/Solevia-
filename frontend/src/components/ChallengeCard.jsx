import React from "react";
import { Trophy, Users, Calendar } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const ChallengeCard = ({ challenge }) => {
    const navigate = useNavigate();

    const trackingTypeColors = {
        mood: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
        habit: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        journal: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
        manual: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
    };

    const difficultyColors = {
        easy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
        medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
        hard: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
    };

    return (
        <div
            onClick={() => navigate(`/challenges/${challenge._id}`)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-[#f4873e] min-h-0 overflow-hidden flex flex-col"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${trackingTypeColors[challenge.trackingType]}`}>
                        {challenge.trackingType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${difficultyColors[challenge.difficulty]}`}>
                        {challenge.difficulty}
                    </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {challenge.daysRemaining}d left
                </span>
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{challenge.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{challenge.description}</p>

            {challenge.isJoined && (
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Your progress</span>
                        <span>{challenge.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] h-1.5 rounded-full"
                            style={{ width: `${challenge.completionPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {challenge.participantCount}
                </span>
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {challenge.duration} days
                </span>
                {challenge.isJoined && (
                    <span className="text-[#f4873e] font-bold">✓ Joined</span>
                )}
            </div>
        </div>
    );
};

export default ChallengeCard;