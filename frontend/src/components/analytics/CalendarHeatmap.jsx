import React from 'react';
import { Calendar } from 'lucide-react';

const CalendarHeatmap = ({ data }) => {
    // Handle case where data is undefined, null, or empty
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                        Habit Heatmap
                    </h3>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                    No habit data available
                </div>
            </div>
        );
    }

    const last90Days = data.slice(-90);

    const getColor = (completion) => {
        // Handle string completion values (convert to number)
        const numCompletion = typeof completion === 'string' ? parseFloat(completion) : completion;
        
        if (numCompletion === 0 || numCompletion === undefined || numCompletion === null || isNaN(numCompletion))
            return 'bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500';
        if (numCompletion < 0.25) return 'bg-green-200 dark:bg-green-900 border border-green-300 dark:border-green-800';
        if (numCompletion < 0.5) return 'bg-green-300 dark:bg-green-800 border border-green-400 dark:border-green-700';
        if (numCompletion < 0.75) return 'bg-green-400 dark:bg-green-700 border border-green-500 dark:border-green-600';
        return 'bg-green-500 dark:bg-green-600 border border-green-600 dark:border-green-500';
    };

    // Group into weeks of 7
    const weeks = [];
    for (let i = 0; i < last90Days.length; i += 7) {
        weeks.push(last90Days.slice(i, i + 7));
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                    Habit Heatmap
                </h3>
            </div>

            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 gap-1.5 mb-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                        {d}
                    </div>
                ))}
            </div>

            {/* Full-width grid — each week is a row of 7 equal cells */}
            <div className="flex-1 flex flex-col gap-1.5">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1.5 flex-1">
                        {/* Fill missing days at end of last week with empty placeholders */}
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const day = week[dayIndex];
                            if (!day) {
                                return <div key={dayIndex} className="rounded-md" />;
                            }
                            return (
                                <div
                                    key={dayIndex}
                                    className={`rounded-md ${getColor(day.completion)} transition-all hover:scale-110 cursor-pointer relative group min-h-[20px]`}
                                    title={`${new Date(day.date).toLocaleDateString()}: ${Math.round((day.completion || 0) * 100)}%`}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        <br />
                                        {Math.round((day.completion || 0) * 100)}% completed
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>Less</span>
                <div className="flex gap-1 flex-1">
                    <div className="flex-1 h-3 rounded bg-gray-200 dark:bg-gray-600"></div>
                    <div className="flex-1 h-3 rounded bg-green-200 dark:bg-green-900"></div>
                    <div className="flex-1 h-3 rounded bg-green-300 dark:bg-green-800"></div>
                    <div className="flex-1 h-3 rounded bg-green-400 dark:bg-green-700"></div>
                    <div className="flex-1 h-3 rounded bg-green-500 dark:bg-green-600"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default CalendarHeatmap;