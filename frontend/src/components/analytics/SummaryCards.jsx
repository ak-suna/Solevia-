// import React from 'react';
// import { Calendar, CheckCircle2, BookOpen, Target, TrendingUp, Smile } from 'lucide-react';

// const SummaryCards = ({ thisWeek, thisMonth }) => {
//     const weekStats = [
//         {
//             label: 'Mood Check-ins',
//             value: thisWeek.moodCheckins,
//             icon: Smile,
//             color: 'from-pink-500 to-pink-600',
//             bgColor: 'bg-pink-50 dark:bg-pink-900/20'
//         },
//         {
//             label: 'Habits Completed',
//             value: `${thisWeek.habitsCompleted}/${thisWeek.habitsTotal}`,
//             icon: CheckCircle2,
//             color: 'from-green-500 to-green-600',
//             bgColor: 'bg-green-50 dark:bg-green-900/20'
//         },
//         {
//             label: 'Journal Entries',
//             value: thisWeek.journalEntries,
//             icon: BookOpen,
//             color: 'from-purple-500 to-purple-600',
//             bgColor: 'bg-purple-50 dark:bg-purple-900/20'
//         },
//         {
//             label: 'Avg Mood',
//             value: `${thisWeek.avgMood}/5`,
//             icon: TrendingUp,
//             color: 'from-blue-500 to-blue-600',
//             bgColor: 'bg-blue-50 dark:bg-blue-900/20'
//         }
//     ];

//     const monthStats = [
//         {
//             label: 'Journal Entries',
//             value: thisMonth.journalEntries,
//             icon: BookOpen,
//             color: 'from-purple-500 to-purple-600',
//             bgColor: 'bg-purple-50 dark:bg-purple-900/20'
//         },
//         {
//             label: 'Goals Completed',
//             value: thisMonth.goalsCompleted,
//             icon: Target,
//             color: 'from-orange-500 to-orange-600',
//             bgColor: 'bg-orange-50 dark:bg-orange-900/20'
//         },
//         {
//             label: 'Habits Completed',
//             value: thisMonth.habitsCompleted,
//             icon: CheckCircle2,
//             color: 'from-green-500 to-green-600',
//             bgColor: 'bg-green-50 dark:bg-green-900/20'
//         },
//         {
//             label: 'Avg Mood',
//             value: `${thisMonth.avgMood}/5`,
//             icon: TrendingUp,
//             color: 'from-blue-500 to-blue-600',
//             bgColor: 'bg-blue-50 dark:bg-blue-900/20'
//         }
//     ];

//     return (
//         <div className="grid grid-cols-2 gap-6 mb-6">
//             {/* This Week Card */}
//             <div className="bg-gradient-to-br from-[#89beab]/10 to-[#6fa893]/10 dark:from-[#89beab]/20 dark:to-[#6fa893]/20 rounded-3xl p-6 border-2 border-[#89beab]/30 dark:border-[#89beab]/50">
//                 <div className="flex items-center gap-2 mb-4">
//                     <Calendar className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
//                     <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                         This Week
//                     </h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                     {weekStats.map((stat, index) => (
//                         <div
//                             key={index}
//                             className={`${stat.bgColor} rounded-2xl p-4 border border-gray-200 dark:border-gray-700`}
//                         >
//                             <div className="flex items-center gap-2 mb-2">
//                                 <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
//                                     <stat.icon className="w-4 h-4 text-white" />
//                                 </div>
//                             </div>
//                             <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
//                             <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* This Month Card */}
//             <div className="bg-gradient-to-br from-[#f8ba90]/10 to-[#f4873e]/10 dark:from-[#f8ba90]/20 dark:to-[#f4873e]/20 rounded-3xl p-6 border-2 border-[#f4873e]/30 dark:border-[#f4873e]/50">
//                 <div className="flex items-center gap-2 mb-4">
//                     <Calendar className="w-5 h-5 text-[#f4873e] dark:text-orange-400" />
//                     <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                         This Month
//                     </h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                     {monthStats.map((stat, index) => (
//                         <div
//                             key={index}
//                             className={`${stat.bgColor} rounded-2xl p-4 border border-gray-200 dark:border-gray-700`}
//                         >
//                             <div className="flex items-center gap-2 mb-2">
//                                 <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
//                                     <stat.icon className="w-4 h-4 text-white" />
//                                 </div>
//                             </div>
//                             <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
//                             <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SummaryCards;
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