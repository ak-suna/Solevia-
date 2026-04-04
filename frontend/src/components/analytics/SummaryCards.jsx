import React from 'react';
import { CheckCircle2, BookOpen, Target, TrendingUp, Smile, ArrowUp, ArrowDown } from 'lucide-react';

const Delta = ({ value }) => {
    if (!value || value === 0) return null;
    const positive = value > 0;
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ml-1 ${positive ? 'text-green-500' : 'text-red-400'}`}>
            {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(value)}
        </span>
    );
};

const SparkCard = ({ label, value, delta, icon: Icon, iconColor, suffix }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-600 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
            <Icon className={`w-4 h-4 ${iconColor}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
        </div>
        <div className="flex items-baseline gap-0">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            {suffix && <span className="text-sm text-gray-400 dark:text-gray-500 ml-0.5">{suffix}</span>}
            {delta !== undefined && <Delta value={delta} />}
        </div>
    </div>
);

const SummaryCards = ({ thisWeek, thisMonth }) => {
    return (
        <div className="mb-6">
            {/* Single compact row of spark cards */}
            <div className="grid grid-cols-4 gap-3 mb-3">
                <SparkCard
                    label="Avg Mood"
                    value={thisWeek.avgMood}
                    suffix="/5"
                    delta={thisWeek.avgMoodDelta}
                    icon={Smile}
                    iconColor="text-pink-400"
                />
                <SparkCard
                    label="Habits Done"
                    value={`${thisWeek.habitsCompleted}/${thisWeek.habitsTotal}`}
                    delta={thisWeek.habitsDelta}
                    icon={CheckCircle2}
                    iconColor="text-[#89beab]"
                />
                <SparkCard
                    label="Journal Entries"
                    value={thisWeek.journalEntries}
                    delta={thisWeek.journalDelta}
                    icon={BookOpen}
                    iconColor="text-purple-400"
                />
                <SparkCard
                    label="Goals Completed"
                    value={thisMonth.goalsCompleted}
                    icon={Target}
                    iconColor="text-[#f4873e]"
                />
            </div>

            {/* Month vs Week comparison bar */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#89beab]/10 dark:bg-[#89beab]/20 rounded-2xl px-5 py-3 border border-[#89beab]/30 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">This week mood check-ins</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{thisWeek.moodCheckins}</span>
                </div>
                <div className="bg-[#f4873e]/10 dark:bg-[#f4873e]/20 rounded-2xl px-5 py-3 border border-[#f4873e]/30 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Month habits completed</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{thisMonth.habitsCompleted}</span>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;