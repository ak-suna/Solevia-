// import React from 'react';
// import { Bar, Line } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// } from 'chart.js';
// import { Activity } from 'lucide-react';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

// const ActivityCharts = ({ journalFrequency, habitCompletion }) => {
//     const journalData = {
//         labels: journalFrequency.map(d => d.week),
//         datasets: [
//             {
//                 label: 'Journal Entries',
//                 data: journalFrequency.map(d => d.count),
//                 backgroundColor: 'rgba(139, 92, 246, 0.7)',
//                 borderColor: '#8b5cf6',
//                 borderWidth: 2,
//                 borderRadius: 8
//             }
//         ]
//     };

//     const habitData = {
//         labels: habitCompletion.map(d => d.week),
//         datasets: [
//             {
//                 label: 'Completion %',
//                 data: habitCompletion.map(d => d.percentage),
//                 borderColor: '#89beab',
//                 backgroundColor: 'rgba(137, 190, 171, 0.1)',
//                 tension: 0.4,
//                 fill: true,
//                 pointRadius: 4,
//                 pointHoverRadius: 6,
//                 borderWidth: 2
//             }
//         ]
//     };

//     const journalOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                 padding: 12,
//                 cornerRadius: 8
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 ticks: {
//                     stepSize: 1,
//                     color: '#6b7280'
//                 },
//                 grid: {
//                     color: 'rgba(0, 0, 0, 0.05)'
//                 }
//             },
//             x: {
//                 grid: {
//                     display: false
//                 },
//                 ticks: {
//                     color: '#6b7280'
//                 }
//             }
//         }
//     };

//     const habitOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                 padding: 12,
//                 cornerRadius: 8,
//                 callbacks: {
//                     label: function (context) {
//                         return `Completion: ${context.parsed.y}%`;
//                     }
//                 }
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 max: 100,
//                 ticks: {
//                     callback: function (value) {
//                         return value + '%';
//                     },
//                     color: '#6b7280'
//                 },
//                 grid: {
//                     color: 'rgba(0, 0, 0, 0.05)'
//                 }
//             },
//             x: {
//                 grid: {
//                     display: false
//                 },
//                 ticks: {
//                     color: '#6b7280'
//                 }
//             }
//         }
//     };

//     return (
//         <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
//             <div className="flex items-center gap-2 mb-6">
//                 <Activity className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                      Activity Overview
//                 </h3>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//                 {/* Journal Frequency */}
//                 <div>
//                     <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                         📝 Journal Frequency
//                     </h4>
//                     <div className="h-48">
//                         <Bar data={journalData} options={journalOptions} />
//                     </div>
//                 </div>

//                 {/* Habit Completion */}
//                 <div>
//                     <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                         ✅ Habit Completion Rate
//                     </h4>
//                     <div className="h-48">
//                         <Line data={habitData} options={habitOptions} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ActivityCharts;



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
import { Activity, Trophy, PieChart } from 'lucide-react';

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
    
    // Prepare pie chart data
    const pieChartData = useMemo(() => {
        if (!effortAllocation || (effortAllocation.goalLinked === 0 && effortAllocation.standalone === 0)) {
            return null;
        }
        
        return {
            labels: ['Goal-Linked Habits', 'Standalone Habits'],
            datasets: [
                {
                    data: [effortAllocation.goalLinked, effortAllocation.standalone],
                    backgroundColor: ['#2e7d64', '#9ca3af'],
                    borderColor: ['#246653', '#6b7280'],
                    borderWidth: 2,
                }
            ]
        };
    }, [effortAllocation]);
    
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 12
                    },
                    padding: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} habits (${percentage}%)`;
                    }
                }
            }
        }
    };
    
    const journalData = {
        labels: journalFrequency.map(d => d.week),
        datasets: [
            {
                label: 'Journal Entries',
                data: journalFrequency.map(d => d.count),
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: '#8b5cf6',
                borderWidth: 2,
                borderRadius: 8
            }
        ]
    };
    
    const habitData = {
        labels: habitCompletion.map(d => d.week),
        datasets: [
            {
                label: 'Completion %',
                data: habitCompletion.map(d => d.percentage),
                borderColor: '#89beab',
                backgroundColor: 'rgba(137, 190, 171, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2
            }
        ]
    };
    
    const journalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: '#6b7280'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280'
                }
            }
        }
    };
    
    const habitOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return `Completion: ${context.parsed.y}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    },
                    color: '#6b7280'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280'
                }
            }
        }
    };
    
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
                    afterBody: function(tooltipItems) {
                        const dayIndex = tooltipItems[0].dataIndex;
                        const dayData = dailyHabitBreakdown?.slice(-7)[dayIndex];
                        if (dayData && dayData.milestones && dayData.milestones.length > 0) {
                            return ['', '🏆 Goal Milestones Reached:'];
                        }
                        return [];
                    },
                    footer: function(tooltipItems) {
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
                        📝 Journal Frequency
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
                    ✅ Habit Completion Rate Trend
                </h4>
                <div className="h-48">
                    <Bar data={habitData} options={habitOptions} />
                </div>
            </div> */}
        </div>
    );
};

export default ActivityCharts;

// import React, { useRef, useEffect, useState } from 'react';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import { Activity, Trophy, Target, TrendingUp, BookOpen } from 'lucide-react';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // ─── Milestone trophy overlay plugin ────────────────────────────────────────
// const trophyPlugin = {
//     id: 'trophyOverlay',
//     afterDatasetsDraw(chart) {
//         const { ctx, data, scales } = chart;
//         const milestones = chart.config.options._milestones || [];
//         if (!milestones.length) return;

//         milestones.forEach(({ labelIndex, goalName }) => {
//             if (labelIndex < 0 || labelIndex >= data.labels.length) return;
//             const meta = chart.getDatasetMeta(0);
//             if (!meta.data[labelIndex]) return;

//             const bar = meta.data[labelIndex];
//             const x = bar.x;
//             const y = scales.y.getPixelForValue(scales.y.max) - 4;

//             // Gold circle
//             ctx.save();
//             ctx.beginPath();
//             ctx.arc(x, y, 12, 0, Math.PI * 2);
//             ctx.fillStyle = '#f59e0b';
//             ctx.shadowColor = 'rgba(245,158,11,0.4)';
//             ctx.shadowBlur = 8;
//             ctx.fill();
//             ctx.restore();

//             // Trophy text
//             ctx.save();
//             ctx.font = '13px serif';
//             ctx.textAlign = 'center';
//             ctx.textBaseline = 'middle';
//             ctx.fillText('🏆', x, y);
//             ctx.restore();
//         });
//     }
// };

// // ─── Insight side panel ──────────────────────────────────────────────────────
// const InsightPanel = ({ journalFrequency, habitCompletion }) => {
//     // Velocity: avg habits per week
//     const avgHabitsPerWeek = habitCompletion.length
//         ? Math.round(habitCompletion.reduce((s, d) => s + (d.percentage || 0), 0) / habitCompletion.length)
//         : 0;

//     // Success pattern: weeks ≥80% vs goal completion
//     const highWeeks = habitCompletion.filter(d => (d.percentage || 0) >= 80).length;
//     const totalWeeks = habitCompletion.length || 1;
//     const highRatio = Math.round((highWeeks / totalWeeks) * 100);

//     // Journal vs habit alignment
//     const journalDays = journalFrequency.reduce((s, d) => s + (d.count || 0), 0);
//     const journalRate = Math.min(100, Math.round((journalDays / (totalWeeks * 7)) * 100));

//     return (
//         <div className="flex flex-col gap-3 w-64 flex-shrink-0">
//             {/* Velocity */}
//             <div className="bg-[#89beab]/10 dark:bg-[#89beab]/20 rounded-2xl p-4 border border-[#89beab]/30">
//                 <div className="flex items-center gap-2 mb-2">
//                     <TrendingUp className="w-4 h-4 text-[#089171] dark:text-teal-400" />
//                     <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Velocity</span>
//                 </div>
//                 <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
//                     Averaging <span className="font-bold text-[#089171] dark:text-teal-300">{avgHabitsPerWeek}%</span> habit completion per week.{' '}
//                     {avgHabitsPerWeek >= 80
//                         ? 'You\'re on track — keep it up!'
//                         : 'Pushing to 80% would unlock streak milestones.'}
//                 </p>
//             </div>

//             {/* Success pattern */}
//             <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
//                 <div className="flex items-center gap-2 mb-2">
//                     <Trophy className="w-4 h-4 text-amber-500" />
//                     <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Success Pattern</span>
//                 </div>
//                 <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
//                     <span className="font-bold text-amber-600 dark:text-amber-400">{highRatio}%</span> of your weeks hit ≥80% completion — the threshold where goal completions are most likely.
//                 </p>
//             </div>

//             {/* Journal alignment */}
//             <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
//                 <div className="flex items-center gap-2 mb-2">
//                     <BookOpen className="w-4 h-4 text-purple-500" />
//                     <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Journal Alignment</span>
//                 </div>
//                 <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
//                     You journaled on <span className="font-bold text-purple-600 dark:text-purple-300">{journalRate}%</span> of days this period.
//                 </p>
//                 {/* Mini progress bar */}
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
//                     <div
//                         className="bg-purple-400 h-1.5 rounded-full transition-all duration-500"
//                         style={{ width: `${journalRate}%` }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ─── Empty state ─────────────────────────────────────────────────────────────
// const EmptyState = () => (
//     <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
//         <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
//             <Activity className="w-8 h-8 text-gray-300 dark:text-gray-500" />
//         </div>
//         <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
//             Start a habit to see your goal momentum build!
//         </p>
//     </div>
// );

// // ─── Main component ──────────────────────────────────────────────────────────
// const ActivityCharts = ({ journalFrequency, habitCompletion, goalMilestones }) => {
//     // goalMilestones: [{ week: 'Week 3', goalName: 'Run 5k' }, ...]  (optional)
//     const milestones = goalMilestones || [];

//     const isEmpty = !habitCompletion || habitCompletion.length === 0;

//     // Map milestone labels to their index in habitCompletion
//     const milestoneMapped = milestones.map(m => ({
//         labelIndex: (habitCompletion || []).findIndex(d => d.week === m.week),
//         goalName: m.goalName
//     })).filter(m => m.labelIndex >= 0);

//     // Bar colors: gradient from light to dark green based on percentage
//     const getBarColor = (pct) => {
//         if (!pct || pct === 0) return 'rgba(209,250,229,0.6)'; // empty
//         if (pct < 25) return '#bbf7d0'; // green-200
//         if (pct < 50) return '#86efac'; // green-300
//         if (pct < 75) return '#4ade80'; // green-400
//         if (pct < 90) return '#22c55e'; // green-500
//         return '#16a34a';                 // green-600
//     };

//     const labels = (habitCompletion || []).map(d => d.week);
//     const percentages = (habitCompletion || []).map(d => d.percentage || 0);

//     const chartData = {
//         labels,
//         datasets: [
//             {
//                 label: 'Habit Completion %',
//                 data: percentages,
//                 backgroundColor: percentages.map(getBarColor),
//                 borderRadius: 8,
//                 borderSkipped: false,
//                 maxBarThickness: 48
//             }
//         ]
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         _milestones: milestoneMapped,
//         plugins: {
//             legend: { display: false },
//             tooltip: {
//                 backgroundColor: 'rgba(17,24,39,0.9)',
//                 padding: 12,
//                 cornerRadius: 10,
//                 callbacks: {
//                     title: (items) => items[0].label,
//                     label: (ctx) => `Completion: ${ctx.parsed.y}%`,
//                     afterLabel: (ctx) => {
//                         const m = milestoneMapped.find(m => m.labelIndex === ctx.dataIndex);
//                         return m ? `🏆 Completed: ${m.goalName}` : null;
//                     }
//                 }
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 max: 100,
//                 ticks: {
//                     callback: v => v + '%',
//                     color: '#9ca3af',
//                     font: { size: 11 }
//                 },
//                 grid: { color: 'rgba(156,163,175,0.1)' },
//                 border: { display: false }
//             },
//             x: {
//                 grid: { display: false },
//                 ticks: { color: '#9ca3af', font: { size: 11 } },
//                 border: { display: false }
//             }
//         }
//     };

//     return (
//         <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
//             {/* Header */}
//             <div className="flex items-center gap-2 mb-5">
//                 <Activity className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                     Activity Correlation
//                 </h3>
//                 {milestoneMapped.length > 0 && (
//                     <div className="ml-auto flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
//                         <Trophy className="w-3 h-3" />
//                         {milestoneMapped.length} goal{milestoneMapped.length > 1 ? 's' : ''} completed
//                     </div>
//                 )}
//             </div>

//             {isEmpty ? (
//                 <EmptyState />
//             ) : (
//                 <div className="flex gap-5">
//                     {/* Chart */}
//                     <div className="flex-1 flex flex-col">
//                         {/* Color legend */}
//                         <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
//                             <span>Completion:</span>
//                             <div className="flex items-center gap-1">
//                                 <span className="w-3 h-3 rounded-sm inline-block bg-green-200"></span> Low
//                             </div>
//                             <div className="flex items-center gap-1">
//                                 <span className="w-3 h-3 rounded-sm inline-block bg-green-400"></span> Mid
//                             </div>
//                             <div className="flex items-center gap-1">
//                                 <span className="w-3 h-3 rounded-sm inline-block bg-green-600"></span> High
//                             </div>
//                             {milestoneMapped.length > 0 && (
//                                 <div className="flex items-center gap-1 ml-2">
//                                     <span className="text-sm">🏆</span> Goal milestone
//                                 </div>
//                             )}
//                         </div>

//                         <div style={{ height: '220px', position: 'relative' }}>
//                             <Bar
//                                 data={chartData}
//                                 options={options}
//                                 plugins={[trophyPlugin]}
//                             />
//                         </div>
//                     </div>

//                     {/* Insight side panel */}
//                     <InsightPanel
//                         journalFrequency={journalFrequency}
//                         habitCompletion={habitCompletion}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ActivityCharts;