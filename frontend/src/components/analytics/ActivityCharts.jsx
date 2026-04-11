import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Activity, Trophy } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ActivityCharts = ({ journalFrequency, habitCompletion, dailyHabitBreakdown, effortAllocation }) => {

    // Prepare stacked bar chart data
    const stackedBarData = useMemo(() => {
        if (!dailyHabitBreakdown || dailyHabitBreakdown.length === 0) {
            return null;
        }

        // Get last 7 days for better visibility
        const last7Days = dailyHabitBreakdown.slice(-7);

        const labels = last7Days.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        });

        const goalLinkedData = last7Days.map(day => day.goalLinkedCount);
        const standaloneData = last7Days.map(day => day.standaloneCount);

        return {
            labels,
            datasets: [
                {
                    label: 'Goal-Linked Habits',
                    data: goalLinkedData,
                    backgroundColor: '#2e7d64', // Deep green for goal-linked
                    borderColor: '#246653',
                    borderWidth: 1,
                    borderRadius: 8,
                    stack: 'stack0'
                },
                {
                    label: 'Standalone Habits',
                    data: standaloneData,
                    backgroundColor: '#9ca3af', // Gray for standalone
                    borderColor: '#6b7280',
                    borderWidth: 1,
                    borderRadius: 8,
                    stack: 'stack0'
                }
            ]
        };
    }, [dailyHabitBreakdown]);

    // // Prepare pie chart data
    // const pieChartData = useMemo(() => {
    //     if (!effortAllocation || (effortAllocation.goalLinked === 0 && effortAllocation.standalone === 0)) {
    //         return null;
    //     }

    //     return {
    //         labels: ['Goal-Linked Habits', 'Standalone Habits'],
    //         datasets: [
    //             {
    //                 data: [effortAllocation.goalLinked, effortAllocation.standalone],
    //                 backgroundColor: ['#2e7d64', '#9ca3af'],
    //                 borderColor: ['#246653', '#6b7280'],
    //                 borderWidth: 2,
    //             }
    //         ]
    //     };
    // }, [effortAllocation]);

    // const pieOptions = {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins: {
    //         legend: {
    //             position: 'bottom',
    //             labels: {
    //                 font: {
    //                     size: 12
    //                 },
    //                 padding: 10
    //             }
    //         },
    //         tooltip: {
    //             callbacks: {
    //                 label: function (context) {
    //                     const label = context.label || '';
    //                     const value = context.parsed || 0;
    //                     const total = context.dataset.data.reduce((a, b) => a + b, 0);
    //                     const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    //                     return `${label}: ${value} habits (${percentage}%)`;
    //                 }
    //             }
    //         }
    //     }
    // };

    // const journalData = {
    //     labels: journalFrequency.map(d => d.week),
    //     datasets: [
    //         {
    //             label: 'Journal Entries',
    //             data: journalFrequency.map(d => d.count),
    //             backgroundColor: 'rgba(139, 92, 246, 0.7)',
    //             borderColor: '#8b5cf6',
    //             borderWidth: 2,
    //             borderRadius: 8
    //         }
    //     ]
    // };

    // const habitData = {
    //     labels: habitCompletion.map(d => d.week),
    //     datasets: [
    //         {
    //             label: 'Completion %',
    //             data: habitCompletion.map(d => d.percentage),
    //             borderColor: '#89beab',
    //             backgroundColor: 'rgba(137, 190, 171, 0.1)',
    //             tension: 0.4,
    //             fill: true,
    //             pointRadius: 4,
    //             pointHoverRadius: 6,
    //             borderWidth: 2
    //         }
    //     ]
    // };

    // const journalOptions = {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins: {
    //         legend: {
    //             display: false
    //         },
    //         tooltip: {
    //             backgroundColor: 'rgba(0, 0, 0, 0.8)',
    //             padding: 12,
    //             cornerRadius: 8
    //         }
    //     },
    //     scales: {
    //         y: {
    //             beginAtZero: true,
    //             ticks: {
    //                 stepSize: 1,
    //                 color: '#6b7280'
    //             },
    //             grid: {
    //                 color: 'rgba(0, 0, 0, 0.05)'
    //             }
    //         },
    //         x: {
    //             grid: {
    //                 display: false
    //             },
    //             ticks: {
    //                 color: '#6b7280'
    //             }
    //         }
    //     }
    // };

    // const habitOptions = {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins: {
    //         legend: {
    //             display: false
    //         },
    //         tooltip: {
    //             backgroundColor: 'rgba(0, 0, 0, 0.8)',
    //             padding: 12,
    //             cornerRadius: 8,
    //             callbacks: {
    //                 label: function (context) {
    //                     return `Completion: ${context.parsed.y}%`;
    //                 }
    //             }
    //         }
    //     },
    //     scales: {
    //         y: {
    //             beginAtZero: true,
    //             max: 100,
    //             ticks: {
    //                 callback: function (value) {
    //                     return value + '%';
    //                 },
    //                 color: '#6b7280'
    //             },
    //             grid: {
    //                 color: 'rgba(0, 0, 0, 0.05)'
    //             }
    //         },
    //         x: {
    //             grid: {
    //                 display: false
    //             },
    //             ticks: {
    //                 color: '#6b7280'
    //             }
    //         }
    //     }
    // };

    const stackedBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    afterBody: function (tooltipItems) {
                        const dayIndex = tooltipItems[0].dataIndex;
                        const dayData = dailyHabitBreakdown?.slice(-7)[dayIndex];
                        if (dayData && dayData.milestones && dayData.milestones.length > 0) {
                            return ['', '🏆 Goal Milestones Reached:'];
                        }
                        return [];
                    },
                    footer: function (tooltipItems) {
                        const dayIndex = tooltipItems[0].dataIndex;
                        const dayData = dailyHabitBreakdown?.slice(-7)[dayIndex];
                        if (dayData && dayData.milestones && dayData.milestones.length > 0) {
                            return dayData.milestones.map(m => `  • ${m.name} (${m.progress}%)`);
                        }
                        return [];
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: '#6b7280'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                title: {
                    display: true,
                    text: 'Number of Habits Completed',
                    color: '#6b7280'
                }
            }
        }
    };

    // Calculate insight text
    const effortInsight = useMemo(() => {
        if (!effortAllocation || effortAllocation.total === 0) return null;

        const goalPercentage = ((effortAllocation.goalLinked / effortAllocation.total) * 100).toFixed(1);

        if (goalPercentage < 20) {
            return " Only 20% of your habits are linked to goals. Link habits to goals to make faster progress!";
        } else if (goalPercentage < 50) {
            return " About half of your habits are goal-linked. Consider linking more habits to accelerate goal achievement!";
        } else if (goalPercentage >= 80) {
            return " Great job! Most of your habits are driving your goals forward!";
        }
        return null;
    }, [effortAllocation]);

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                    Activity Overview
                </h3>
            </div>

            {/* Stacked Bar Chart Section */}
            {stackedBarData && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Daily Habit Breakdown (Last 7 Days)
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Trophy className="w-3 h-3 text-yellow-500" />
                            <span>Trophy = Goal Milestone Reached</span>
                        </div>
                    </div>
                    <div className="h-64">
                        <Bar data={stackedBarData} options={stackedBarOptions} />
                    </div>

                    {/* Effort Insight */}
                    {effortInsight && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                {effortInsight}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Two-column layout for existing charts + pie chart */}
            {/* <div className=" gap-6"> */}
            {/* Journal Frequency */}
            {/* <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                         Journal Frequency
                    </h4>
                    <div className="h-48">
                        <Bar data={journalData} options={journalOptions} />
                    </div>
                </div> */}

            {/* Effort Allocation Pie Chart */}
            {/* {pieChartData && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <PieChart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Effort Allocation
                            </h4>
                        </div>
                        <div className="h-48">
                            <Bar data={pieChartData} options={pieOptions} />
                        </div>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                            {effortAllocation?.total || 0} total habits completed
                        </p>
                    </div>
                )} */}
            {/* </div> */}

            {/* Habit Completion Trend */}
            {/* <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                     Habit Completion Rate Trend
                </h4>
                <div className="h-48">
                    <Bar data={habitData} options={habitOptions} />
                </div>
            </div> */}
        </div>
    );
};

export default ActivityCharts;

