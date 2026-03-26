import React from 'react';
import { Calendar, CheckCircle2, BookOpen, Target, TrendingUp, Smile } from 'lucide-react';

const SummaryCards = ({ thisWeek, thisMonth }) => {
    const weekStats = [
        {
            label: 'Mood Check-ins',
            value: thisWeek.moodCheckins,
            icon: Smile,
            color: 'from-pink-500 to-pink-600',
            bgColor: 'bg-pink-50 dark:bg-pink-900/20'
        },
        {
            label: 'Habits Completed',
            value: `${thisWeek.habitsCompleted}/${thisWeek.habitsTotal}`,
            icon: CheckCircle2,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Journal Entries',
            value: thisWeek.journalEntries,
            icon: BookOpen,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            label: 'Avg Mood',
            value: `${thisWeek.avgMood}/5`,
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        }
    ];

    const monthStats = [
        {
            label: 'Journal Entries',
            value: thisMonth.journalEntries,
            icon: BookOpen,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            label: 'Goals Completed',
            value: thisMonth.goalsCompleted,
            icon: Target,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        },
        {
            label: 'Habits Completed',
            value: thisMonth.habitsCompleted,
            icon: CheckCircle2,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Avg Mood',
            value: `${thisMonth.avgMood}/5`,
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-6 mb-6">
            {/* This Week Card */}
            <div className="bg-gradient-to-br from-[#89beab]/10 to-[#6fa893]/10 dark:from-[#89beab]/20 dark:to-[#6fa893]/20 rounded-3xl p-6 border-2 border-[#89beab]/30 dark:border-[#89beab]/50">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                        This Week
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {weekStats.map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} rounded-2xl p-4 border border-gray-200 dark:border-gray-700`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* This Month Card */}
            <div className="bg-gradient-to-br from-[#f8ba90]/10 to-[#f4873e]/10 dark:from-[#f8ba90]/20 dark:to-[#f4873e]/20 rounded-3xl p-6 border-2 border-[#f4873e]/30 dark:border-[#f4873e]/50">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#f4873e] dark:text-orange-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                        This Month
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {monthStats.map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} rounded-2xl p-4 border border-gray-200 dark:border-gray-700`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;