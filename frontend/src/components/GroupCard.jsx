import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, CheckCircle } from 'lucide-react';

const GroupCard = ({ group, onUpdate }) => {
    const navigate = useNavigate();

    const categoryColors = {
        journaling: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
        gratitude: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
        mindfulness: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
        fitness: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        habits: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        goals: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        wellness: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
        other: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
    };

    const categoryColor = categoryColors[group.category] || categoryColors.other;

    return (
        <div
            onClick={() => navigate(`/community/group/${group._id}`)}
            className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-600 hover:border-[#89beab] dark:hover:border-[#89beab] min-h-0 overflow-hidden flex flex-col"
        >
            {/* Icon and Title */}
            <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{group.icon || "📝"}</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {group.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                        {group.category}
                    </span>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {group.description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{group.memberCount || group.members?.length || 0} members</span>
                </div>

                {group.isFull && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full font-medium">
                        Full
                    </span>
                )}
            </div>

            {/* Weekly Task if exists */}
            {group.weeklyTask?.task && (
                <div className="mt-4 p-3 bg-[#f8ba90]/20 dark:bg-[#f8ba90]/10 rounded-xl">
                    <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[#f4873e] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-[#f4873e] mb-1">This Week's Task</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {group.weeklyTask.task}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupCard;