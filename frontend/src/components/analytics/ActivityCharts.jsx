// // import React, { useMemo } from 'react';
// // import { Bar } from 'react-chartjs-2';
// // import {
// //     Chart as ChartJS,
// //     CategoryScale,
// //     LinearScale,
// //     BarElement,
// //     Title,
// //     Tooltip,
// //     Legend,
// //     ArcElement
// // } from 'chart.js';
// // import { Activity, Trophy } from 'lucide-react';

// // ChartJS.register(
// //     CategoryScale,
// //     LinearScale,
// //     BarElement,
// //     Title,
// //     Tooltip,
// //     Legend,
// //     ArcElement
// // );

// // const ActivityCharts = ({ journalFrequency, habitCompletion, dailyHabitBreakdown, effortAllocation }) => {

// //     // Prepare stacked bar chart data
// //     const stackedBarData = useMemo(() => {
// //         if (!dailyHabitBreakdown || dailyHabitBreakdown.length === 0) {
// //             return null;
// //         }

// //         // Get last 7 days for better visibility
// //         const last7Days = dailyHabitBreakdown.slice(-7);

// //         const labels = last7Days.map(day => {
// //             const date = new Date(day.date);
// //             return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
// //         });

// //         const goalLinkedData = last7Days.map(day => day.goalLinkedCount);
// //         const standaloneData = last7Days.map(day => day.standaloneCount);

// //         return {
// //             labels,
// //             datasets: [
// //                 {
// //                     label: 'Goal-Linked Habits',
// //                     data: goalLinkedData,
// //                     backgroundColor: '#2e7d64', // Deep green for goal-linked
// //                     borderColor: '#246653',
// //                     borderWidth: 1,
// //                     borderRadius: 8,
// //                     stack: 'stack0'
// //                 },
// //                 {
// //                     label: 'Standalone Habits',
// //                     data: standaloneData,
// //                     backgroundColor: '#9ca3af', // Gray for standalone
// //                     borderColor: '#6b7280',
// //                     borderWidth: 1,
// //                     borderRadius: 8,
// //                     stack: 'stack0'
// //                 }
// //             ]
// //         };
// //     }, [dailyHabitBreakdown]);

// //     // // Prepare pie chart data
// //     // const pieChartData = useMemo(() => {
// //     //     if (!effortAllocation || (effortAllocation.goalLinked === 0 && effortAllocation.standalone === 0)) {
// //     //         return null;
// //     //     }

// //     //     return {
// //     //         labels: ['Goal-Linked Habits', 'Standalone Habits'],
// //     //         datasets: [
// //     //             {
// //     //                 data: [effortAllocation.goalLinked, effortAllocation.standalone],
// //     //                 backgroundColor: ['#2e7d64', '#9ca3af'],
// //     //                 borderColor: ['#246653', '#6b7280'],
// //     //                 borderWidth: 2,
// //     //             }
// //     //         ]
// //     //     };
// //     // }, [effortAllocation]);

// //     // const pieOptions = {
// //     //     responsive: true,
// //     //     maintainAspectRatio: false,
// //     //     plugins: {
// //     //         legend: {
// //     //             position: 'bottom',
// //     //             labels: {
// //     //                 font: {
// //     //                     size: 12
// //     //                 },
// //     //                 padding: 10
// //     //             }
// //     //         },
// //     //         tooltip: {
// //     //             callbacks: {
// //     //                 label: function (context) {
// //     //                     const label = context.label || '';
// //     //                     const value = context.parsed || 0;
// //     //                     const total = context.dataset.data.reduce((a, b) => a + b, 0);
// //     //                     const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
// //     //                     return `${label}: ${value} habits (${percentage}%)`;
// //     //                 }
// //     //             }
// //     //         }
// //     //     }
// //     // };

// //     // const journalData = {
// //     //     labels: journalFrequency.map(d => d.week),
// //     //     datasets: [
// //     //         {
// //     //             label: 'Journal Entries',
// //     //             data: journalFrequency.map(d => d.count),
// //     //             backgroundColor: 'rgba(139, 92, 246, 0.7)',
// //     //             borderColor: '#8b5cf6',
// //     //             borderWidth: 2,
// //     //             borderRadius: 8
// //     //         }
// //     //     ]
// //     // };

// //     // const habitData = {
// //     //     labels: habitCompletion.map(d => d.week),
// //     //     datasets: [
// //     //         {
// //     //             label: 'Completion %',
// //     //             data: habitCompletion.map(d => d.percentage),
// //     //             borderColor: '#89beab',
// //     //             backgroundColor: 'rgba(137, 190, 171, 0.1)',
// //     //             tension: 0.4,
// //     //             fill: true,
// //     //             pointRadius: 4,
// //     //             pointHoverRadius: 6,
// //     //             borderWidth: 2
// //     //         }
// //     //     ]
// //     // };

// //     // const journalOptions = {
// //     //     responsive: true,
// //     //     maintainAspectRatio: false,
// //     //     plugins: {
// //     //         legend: {
// //     //             display: false
// //     //         },
// //     //         tooltip: {
// //     //             backgroundColor: 'rgba(0, 0, 0, 0.8)',
// //     //             padding: 12,
// //     //             cornerRadius: 8
// //     //         }
// //     //     },
// //     //     scales: {
// //     //         y: {
// //     //             beginAtZero: true,
// //     //             ticks: {
// //     //                 stepSize: 1,
// //     //                 color: '#6b7280'
// //     //             },
// //     //             grid: {
// //     //                 color: 'rgba(0, 0, 0, 0.05)'
// //     //             }
// //     //         },
// //     //         x: {
// //     //             grid: {
// //     //                 display: false
// //     //             },
// //     //             ticks: {
// //     //                 color: '#6b7280'
// //     //             }
// //     //         }
// //     //     }
// //     // };

// //     // const habitOptions = {
// //     //     responsive: true,
// //     //     maintainAspectRatio: false,
// //     //     plugins: {
// //     //         legend: {
// //     //             display: false
// //     //         },
// //     //         tooltip: {
// //     //             backgroundColor: 'rgba(0, 0, 0, 0.8)',
// //     //             padding: 12,
// //     //             cornerRadius: 8,
// //     //             callbacks: {
// //     //                 label: function (context) {
// //     //                     return `Completion: ${context.parsed.y}%`;
// //     //                 }
// //     //             }
// //     //         }
// //     //     },
// //     //     scales: {
// //     //         y: {
// //     //             beginAtZero: true,
// //     //             max: 100,
// //     //             ticks: {
// //     //                 callback: function (value) {
// //     //                     return value + '%';
// //     //                 },
// //     //                 color: '#6b7280'
// //     //             },
// //     //             grid: {
// //     //                 color: 'rgba(0, 0, 0, 0.05)'
// //     //             }
// //     //         },
// //     //         x: {
// //     //             grid: {
// //     //                 display: false
// //     //             },
// //     //             ticks: {
// //     //                 color: '#6b7280'
// //     //             }
// //     //         }
// //     //     }
// //     // };

// //     const stackedBarOptions = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //             legend: {
// //                 position: 'top',
// //                 labels: {
// //                     usePointStyle: true,
// //                     boxWidth: 10,
// //                     font: {
// //                         size: 12
// //                     }
// //                 }
// //             },
// //             tooltip: {
// //                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
// //                 padding: 12,
// //                 cornerRadius: 8,
// //                 callbacks: {
// //                     afterBody: function (tooltipItems) {
// //                         const dayIndex = tooltipItems[0].dataIndex;
// //                         const dayData = dailyHabitBreakdown?.slice(-7)[dayIndex];
// //                         if (dayData && dayData.milestones && dayData.milestones.length > 0) {
// //                             return ['', '🏆 Goal Milestones Reached:'];
// //                         }
// //                         return [];
// //                     },
// //                     footer: function (tooltipItems) {
// //                         const dayIndex = tooltipItems[0].dataIndex;
// //                         const dayData = dailyHabitBreakdown?.slice(-7)[dayIndex];
// //                         if (dayData && dayData.milestones && dayData.milestones.length > 0) {
// //                             return dayData.milestones.map(m => `  • ${m.name} (${m.progress}%)`);
// //                         }
// //                         return [];
// //                     }
// //                 }
// //             }
// //         },
// //         scales: {
// //             x: {
// //                 stacked: true,
// //                 grid: {
// //                     display: false
// //                 },
// //                 ticks: {
// //                     color: '#6b7280',
// //                     maxRotation: 45,
// //                     minRotation: 45
// //                 }
// //             },
// //             y: {
// //                 stacked: true,
// //                 beginAtZero: true,
// //                 ticks: {
// //                     stepSize: 1,
// //                     color: '#6b7280'
// //                 },
// //                 grid: {
// //                     color: 'rgba(0, 0, 0, 0.05)'
// //                 },
// //                 title: {
// //                     display: true,
// //                     text: 'Number of Habits Completed',
// //                     color: '#6b7280'
// //                 }
// //             }
// //         }
// //     };

// //     // Calculate insight text
// //     const effortInsight = useMemo(() => {
// //         if (!effortAllocation || effortAllocation.total === 0) return null;

// //         const goalPercentage = ((effortAllocation.goalLinked / effortAllocation.total) * 100).toFixed(1);

// //         if (goalPercentage < 20) {
// //             return " Only 20% of your habits are linked to goals. Link habits to goals to make faster progress!";
// //         } else if (goalPercentage < 50) {
// //             return " About half of your habits are goal-linked. Consider linking more habits to accelerate goal achievement!";
// //         } else if (goalPercentage >= 80) {
// //             return " Great job! Most of your habits are driving your goals forward!";
// //         }
// //         return null;
// //     }, [effortAllocation]);

// //     return (
// //         <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
// //             <div className="flex items-center gap-2 mb-6">
// //                 <Activity className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
// //                 <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
// //                     Activity Overview
// //                 </h3>
// //             </div>

// //             {/* Stacked Bar Chart Section */}
// //             {stackedBarData && (
// //                 <div className="mb-8">
// //                     <div className="flex items-center justify-between mb-3">
// //                         <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
// //                             Daily Habit Breakdown (Last 7 Days)
// //                         </h4>
// //                         <div className="flex items-center gap-2 text-xs text-gray-500">
// //                             <Trophy className="w-3 h-3 text-yellow-500" />
// //                             <span>Trophy = Goal Milestone Reached</span>
// //                         </div>
// //                     </div>
// //                     <div className="h-64">
// //                         <Bar data={stackedBarData} options={stackedBarOptions} />
// //                     </div>

// //                     {/* Effort Insight */}
// //                     {effortInsight && (
// //                         <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
// //                             <p className="text-sm text-blue-800 dark:text-blue-300">
// //                                 {effortInsight}
// //                             </p>
// //                         </div>
// //                     )}
// //                 </div>
// //             )}

// //             {/* Two-column layout for existing charts + pie chart */}
// //             {/* <div className=" gap-6"> */}
// //             {/* Journal Frequency */}
// //             {/* <div>
// //                     <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
// //                          Journal Frequency
// //                     </h4>
// //                     <div className="h-48">
// //                         <Bar data={journalData} options={journalOptions} />
// //                     </div>
// //                 </div> */}

// //             {/* Effort Allocation Pie Chart */}
// //             {/* {pieChartData && (
// //                     <div>
// //                         <div className="flex items-center gap-2 mb-3">
// //                             <PieChart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
// //                             <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
// //                                 Effort Allocation
// //                             </h4>
// //                         </div>
// //                         <div className="h-48">
// //                             <Bar data={pieChartData} options={pieOptions} />
// //                         </div>
// //                         <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
// //                             {effortAllocation?.total || 0} total habits completed
// //                         </p>
// //                     </div>
// //                 )} */}
// //             {/* </div> */}

// //             {/* Habit Completion Trend */}
// //             {/* <div className="mt-6">
// //                 <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
// //                      Habit Completion Rate Trend
// //                 </h4>
// //                 <div className="h-48">
// //                     <Bar data={habitData} options={habitOptions} />
// //                 </div>
// //             </div> */}
// //         </div>
// //     );
// // };

// // export default ActivityCharts;

// import React, { useMemo } from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
//     LineElement,
//     PointElement
// } from 'chart.js';
// import { Activity, Trophy, Target, TrendingUp } from 'lucide-react';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
//     LineElement,
//     PointElement
// );

// const ActivityCharts = ({ journalFrequency, habitCompletion, dailyHabitBreakdown, effortAllocation, activeGoals = [] }) => {

//     // Prepare stacked bar chart data
//     const stackedBarData = useMemo(() => {
//         if (!dailyHabitBreakdown || dailyHabitBreakdown.length === 0) {
//             return null;
//         }

//         // Get last 7 days for better visibility
//         const last7Days = dailyHabitBreakdown.slice(-7);

//         const labels = last7Days.map(day => {
//             const date = new Date(day.date);
//             return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
//         });

//         const goalLinkedData = last7Days.map(day => day.goalLinkedCount);
//         const standaloneData = last7Days.map(day => day.standaloneCount);

//         return {
//             labels,
//             datasets: [
//                 {
//                     label: 'Goal-Linked Habits',
//                     data: goalLinkedData,
//                     backgroundColor: '#2e7d64',
//                     borderColor: '#246653',
//                     borderWidth: 1,
//                     borderRadius: 8,
//                     stack: 'stack0'
//                 },
//                 {
//                     label: 'Standalone Habits',
//                     data: standaloneData,
//                     backgroundColor: '#9ca3af',
//                     borderColor: '#6b7280',
//                     borderWidth: 1,
//                     borderRadius: 8,
//                     stack: 'stack0'
//                 }
//             ]
//         };
//     }, [dailyHabitBreakdown]);

//     const stackedBarOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'top',
//                 labels: {
//                     usePointStyle: true,
//                     boxWidth: 10,
//                     font: {
//                         size: 12
//                     }
//                 }
//             },
//             tooltip: {
//                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                 padding: 12,
//                 cornerRadius: 8,
//                 callbacks: {
//                     afterBody: function (tooltipItems) {
//                         const dayIndex = tooltipItems[0].dataIndex;
//                         const dayData = dailyHabitBreakdown?.slice(-7)[dayIndex];
//                         if (dayData && dayData.milestones && dayData.milestones.length > 0) {
//                             return ['', '🏆 Goal Milestones Reached:'];
//                         }
//                         return [];
//                     },
//                     footer: function (tooltipItems) {
//                         const dayIndex = tooltipItems[0].dataIndex;
//                         const dayData = dailyHabitBreakdown?.slice(-7)[dayIndex];
//                         if (dayData && dayData.milestones && dayData.milestones.length > 0) {
//                             return dayData.milestones.map(m => `  • ${m.name} (${m.progress}%)`);
//                         }
//                         return [];
//                     }
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 stacked: true,
//                 grid: {
//                     display: false
//                 },
//                 ticks: {
//                     color: '#6b7280',
//                     maxRotation: 45,
//                     minRotation: 45
//                 }
//             },
//             y: {
//                 stacked: true,
//                 beginAtZero: true,
//                 ticks: {
//                     stepSize: 1,
//                     color: '#6b7280'
//                 },
//                 grid: {
//                     color: 'rgba(0, 0, 0, 0.05)'
//                 },
//                 title: {
//                     display: true,
//                     text: 'Number of Habits Completed',
//                     color: '#6b7280'
//                 }
//             }
//         }
//     };

//     // NEW: Goal Milestone Roadmap Component
//     const GoalMilestoneRoadmap = ({ goals }) => {
//         if (!goals || goals.length === 0) {
//             return (
//                 <div className="text-center py-8">
//                     <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
//                     <p className="text-sm text-gray-500 dark:text-gray-400">No active goals yet</p>
//                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create goals to see your progress roadmap</p>
//                 </div>
//             );
//         }

//         // Get top 4 goals with highest progress or closest deadlines
//         const topGoals = [...goals]
//             .sort((a, b) => {
//                 // Sort by progress (higher first) then by days remaining (closer first)
//                 if (a.progress !== b.progress) return b.progress - a.progress;
//                 const daysA = a.deadline ? Math.ceil((new Date(a.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : Infinity;
//                 const daysB = b.deadline ? Math.ceil((new Date(b.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : Infinity;
//                 return daysA - daysB;
//             })
//             .slice(0, 4);

//         return (
//             <div className="space-y-4">
//                 <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                         <Target className="w-4 h-4 text-[#f4873e]" />
//                         <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                             Goal Milestone Roadmap
//                         </h4>
//                     </div>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                         {goals.length} active goal{goals.length !== 1 ? 's' : ''}
//                     </span>
//                 </div>

//                 {topGoals.map((goal, idx) => {
//                     const progress = goal.progress || 0;
//                     const daysRemaining = goal.deadline
//                         ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
//                         : null;

//                     // Define milestones at 25%, 50%, 75%, 100%
//                     const milestones = [25, 50, 75, 100];
//                     const reachedMilestones = milestones.filter(m => progress >= m);

//                     // Calculate estimated completion date based on progress rate
//                     const createdAt = new Date(goal.createdAt || new Date());
//                     const daysSinceCreation = Math.max(1, Math.ceil((new Date() - createdAt) / (1000 * 60 * 60 * 24)));
//                     const dailyProgressRate = progress / daysSinceCreation;
//                     const daysToComplete = dailyProgressRate > 0 ? (100 - progress) / dailyProgressRate : null;

//                     return (
//                         <div key={goal.id} className="relative">
//                             {/* Goal header */}
//                             <div className="flex items-center justify-between mb-2">
//                                 <div className="flex-1">
//                                     <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={goal.name}>
//                                         {goal.name}
//                                     </p>
//                                     <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//                                         <span>{goal.current || 0} / {goal.target} {goal.unit}</span>
//                                         {daysRemaining !== null && daysRemaining > 0 && (
//                                             <span>• {daysRemaining} days left</span>
//                                         )}
//                                         {daysToComplete && daysToComplete > 0 && daysToComplete < 30 && (
//                                             <span className="text-green-600 dark:text-green-400">
//                                                 • On track to complete in {Math.ceil(daysToComplete)} days
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <span className="text-lg font-bold text-[#f4873e] ml-3">{progress}%</span>
//                             </div>

//                             {/* Milestone timeline */}
//                             <div className="relative mt-3 mb-2">
//                                 {/* Background track */}
//                                 <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
//                                     {/* Progress bar */}
//                                     <div
//                                         className="h-full bg-gradient-to-r from-[#89beab] to-[#46c294] rounded-full transition-all duration-500"
//                                         style={{ width: `${progress}%` }}
//                                     />
//                                 </div>

//                                 {/* Milestone markers */}
//                                 <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
//                                     {milestones.map((milestone, i) => {
//                                         const isReached = progress >= milestone;
//                                         const position = `${milestone}%`;
//                                         return (
//                                             <div
//                                                 key={milestone}
//                                                 className="absolute transform -translate-x-1/2"
//                                                 style={{ left: position }}
//                                             >
//                                                 <div className="relative group">
//                                                     <div
//                                                         className={`w-4 h-4 rounded-full border-2 transition-all cursor-pointer ${isReached
//                                                                 ? 'bg-[#46c294] border-[#46c294] shadow-lg'
//                                                                 : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500'
//                                                             }`}
//                                                     />
//                                                     {/* Tooltip */}
//                                                     <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
//                                                         <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
//                                                             {milestone}% Milestone
//                                                             {isReached && ' ✓'}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>

//                             {/* Milestone labels */}
//                             <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">
//                                 {milestones.map(milestone => (
//                                     <span key={milestone} className="text-center" style={{ width: '20px' }}>
//                                         {milestone}%
//                                     </span>
//                                 ))}
//                             </div>

//                             {/* Connection to next goal (except last) */}
//                             {idx < topGoals.length - 1 && (
//                                 <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-4 ml-2 my-2" />
//                             )}
//                         </div>
//                     );
//                 })}

//                 {/* Summary stat */}
//                 <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
//                     <div className="flex items-center justify-between text-sm">
//                         <div className="flex items-center gap-2">
//                             <TrendingUp className="w-4 h-4 text-[#89beab]" />
//                             <span className="text-gray-600 dark:text-gray-400">Average Progress</span>
//                         </div>
//                         <span className="font-semibold text-gray-900 dark:text-white">
//                             {Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)}%
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // Calculate insight text
//     const effortInsight = useMemo(() => {
//         if (!effortAllocation || effortAllocation.total === 0) return null;

//         const goalPercentage = ((effortAllocation.goalLinked / effortAllocation.total) * 100).toFixed(1);

//         if (goalPercentage < 20) {
//             return "⚠️ Only 20% of your habits are linked to goals. Link habits to goals to make faster progress!";
//         } else if (goalPercentage < 50) {
//             return "📈 About half of your habits are goal-linked. Consider linking more habits to accelerate goal achievement!";
//         } else if (goalPercentage >= 80) {
//             return "🎉 Great job! Most of your habits are driving your goals forward!";
//         }
//         return null;
//     }, [effortAllocation]);

//     return (
//         <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
//             <div className="flex items-center gap-2 mb-6">
//                 <Activity className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                     Activity Overview
//                 </h3>
//             </div>

//             {/* Two-column layout for charts and goal roadmap */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Left Column: Stacked Bar Chart */}
//                 <div>
//                     {stackedBarData && (
//                         <>
//                             <div className="flex items-center justify-between mb-3">
//                                 <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                                     Daily Habit Breakdown (Last 7 Days)
//                                 </h4>
//                                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                                     <Trophy className="w-3 h-3 text-yellow-500" />
//                                     <span>Trophy = Goal Milestone Reached</span>
//                                 </div>
//                             </div>
//                             <div className="h-64">
//                                 <Bar data={stackedBarData} options={stackedBarOptions} />
//                             </div>

//                             {/* Effort Insight */}
//                             {effortInsight && (
//                                 <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                                     <p className="text-sm text-blue-800 dark:text-blue-300">
//                                         {effortInsight}
//                                     </p>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>

//                 {/* Right Column: Goal Milestone Roadmap */}
//                 <div>
//                     <GoalMilestoneRoadmap goals={activeGoals} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ActivityCharts;
import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

const ActivityCharts = ({ activeGoals = [] }) => {

    // Goal Milestone Roadmap Component
    const GoalMilestoneRoadmap = ({ goals }) => {
        if (!goals || goals.length === 0) {
            return (
                <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No active goals yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Create goals to see your progress roadmap here
                    </p>
                </div>
            );
        }

        // Get top 4 goals with highest progress or closest deadlines
        const topGoals = [...goals]
            .sort((a, b) => {
                // Sort by progress (higher first) then by days remaining (closer first)
                if (a.progress !== b.progress) return b.progress - a.progress;
                const daysA = a.deadline ? Math.ceil((new Date(a.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : Infinity;
                const daysB = b.deadline ? Math.ceil((new Date(b.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : Infinity;
                return daysA - daysB;
            })
            .slice(0, 4);

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#f4873e]" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                            Goal Milestone Roadmap
                        </h3>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {goals.length} active goal{goals.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="space-y-6">
                    {topGoals.map((goal, idx) => {
                        const progress = goal.progress || 0;
                        const daysRemaining = goal.deadline
                            ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                            : null;

                        // Calculate estimated completion date based on progress rate
                        const createdAt = new Date(goal.createdAt || new Date());
                        const daysSinceCreation = Math.max(1, Math.ceil((new Date() - createdAt) / (1000 * 60 * 60 * 24)));
                        const dailyProgressRate = progress / daysSinceCreation;
                        const daysToComplete = dailyProgressRate > 0 ? (100 - progress) / dailyProgressRate : null;

                        // Define milestones at 25%, 50%, 75%, 100%
                        const milestones = [25, 50, 75, 100];

                        return (
                            <div key={goal.id} className="relative">
                                {/* Goal header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-gray-900 dark:text-white truncate" title={goal.name}>
                                            {goal.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span>{goal.current || 0} / {goal.target} {goal.unit}</span>
                                            {daysRemaining !== null && daysRemaining > 0 && (
                                                <span>• {daysRemaining} days left</span>
                                            )}
                                            {daysToComplete && daysToComplete > 0 && daysToComplete < 30 && (
                                                <span className="text-green-600 dark:text-green-400">
                                                    • On track to complete in {Math.ceil(daysToComplete)} days
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-2xl font-bold text-[#f4873e] ml-3">{progress}%</span>
                                </div>

                                {/* Milestone timeline */}
                                <div className="relative mt-4 mb-3">
                                    {/* Background track */}
                                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                        {/* Progress bar */}
                                        <div
                                            className="h-full bg-gradient-to-r from-[#89beab] to-[#46c294] rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    {/* Milestone markers */}
                                    <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
                                        {milestones.map((milestone) => {
                                            const isReached = progress >= milestone;
                                            const position = `${milestone}%`;
                                            return (
                                                <div
                                                    key={milestone}
                                                    className="absolute transform -translate-x-1/2"
                                                    style={{ left: position }}
                                                >
                                                    <div className="relative group">
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${isReached
                                                                    ? 'bg-[#46c294] border-[#46c294] shadow-lg'
                                                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500'
                                                                }`}
                                                        />
                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                                            <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1">
                                                                {milestone}% Milestone
                                                                {isReached && ' ✓'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Milestone labels */}
                                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1 px-1">
                                    {milestones.map(milestone => (
                                        <span key={milestone} className="text-center font-medium" style={{ width: '24px' }}>
                                            {milestone}%
                                        </span>
                                    ))}
                                </div>

                                {/* Connection to next goal (except last) */}
                                {idx < topGoals.length - 1 && (
                                    <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-6 ml-2 my-3" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Summary stat */}
                <div className="mt-6 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#89beab]" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Average Progress Across All Goals</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)}%
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
            <GoalMilestoneRoadmap goals={activeGoals} />
        </div>
    );
};

export default ActivityCharts;