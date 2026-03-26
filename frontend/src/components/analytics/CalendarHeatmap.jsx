import React from 'react';
import { Calendar } from 'lucide-react';

const CalendarHeatmap = ({ data }) => {
    // Take last 90 days
    const last90Days = data.slice(-90);

    // Get color based on completion rate
    const getColor = (completion) => {
        if (completion === 0) return 'bg-gray-200 dark:bg-gray-700';
        if (completion < 0.25) return 'bg-green-200 dark:bg-green-900';
        if (completion < 0.5) return 'bg-green-300 dark:bg-green-800';
        if (completion < 0.75) return 'bg-green-400 dark:bg-green-700';
        return 'bg-green-500 dark:bg-green-600';
    };

    // Group by weeks (7 days each)
    const weeks = [];
    for (let i = 0; i < last90Days.length; i += 7) {
        weeks.push(last90Days.slice(i, i + 7));
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                    📅 Habit Heatmap
                </h3>
            </div>

            <div className="space-y-2">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex gap-2">
                        {week.map((day, dayIndex) => (
                            <div
                                key={dayIndex}
                                className={`w-8 h-8 rounded-lg ${getColor(day.completion)} transition-all hover:scale-110 cursor-pointer relative group`}
                                title={`${new Date(day.date).toLocaleDateString()}: ${Math.round(day.completion * 100)}%`}
                            >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    <br />
                                    {Math.round(day.completion * 100)}% completed
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-900"></div>
                    <div className="w-4 h-4 rounded bg-green-300 dark:bg-green-800"></div>
                    <div className="w-4 h-4 rounded bg-green-400 dark:bg-green-700"></div>
                    <div className="w-4 h-4 rounded bg-green-500 dark:bg-green-600"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default CalendarHeatmap;