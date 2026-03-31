// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler
// } from 'chart.js';
// import { TrendingUp } from 'lucide-react';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler
// );

// const MoodTrendChart = ({ data }) => {
//     // Get last 30 days
//     const labels = data.map(d => {
//         const date = new Date(d.date);
//         return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     });

//     const morningData = data.map(d => d.morning);
//     const eveningData = data.map(d => d.evening);

//     const chartData = {
//         labels,
//         datasets: [
//             {
//                 label: 'Morning Mood',
//                 data: morningData,
//                 borderColor: '#f4873e',
//                 backgroundColor: 'rgba(244, 135, 62, 0.1)',
//                 tension: 0.4,
//                 fill: true,
//                 pointRadius: 3,
//                 pointHoverRadius: 6,
//                 borderWidth: 2
//             },
//             {
//                 label: 'Evening Mood',
//                 data: eveningData,
//                 borderColor: '#89beab',
//                 backgroundColor: 'rgba(137, 190, 171, 0.1)',
//                 tension: 0.4,
//                 fill: true,
//                 pointRadius: 3,
//                 pointHoverRadius: 6,
//                 borderWidth: 2
//             }
//         ]
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'top',
//                 labels: {
//                     font: {
//                         family: 'Brasika',
//                         size: 12
//                     },
//                     color: '#6b7280',
//                     usePointStyle: true,
//                     padding: 15
//                 }
//             },
//             tooltip: {
//                 mode: 'index',
//                 intersect: false,
//                 backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                 titleFont: {
//                     size: 13
//                 },
//                 bodyFont: {
//                     size: 12
//                 },
//                 padding: 12,
//                 cornerRadius: 8,
//                 callbacks: {
//                     label: function (context) {
//                         let label = context.dataset.label || '';
//                         if (label) {
//                             label += ': ';
//                         }
//                         if (context.parsed.y !== null) {
//                             const moods = ['😢 Very Sad', '😔 Sad', '😐 Neutral', '🙂 Good', '😊 Great'];
//                             const moodIndex = Math.round(context.parsed.y) - 1;
//                             label += moods[moodIndex] || 'N/A';
//                         }
//                         return label;
//                     }
//                 }
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: false,
//                 min: 1,
//                 max: 5,
//                 ticks: {
//                     stepSize: 1,
//                     callback: function (value) {
//                         const moods = ['😢', '😔', '😐', '🙂', '😊'];
//                         return moods[value - 1] || '';
//                     },
//                     font: {
//                         size: 16
//                     },
//                     color: '#6b7280'
//                 },
//                 grid: {
//                     color: 'rgba(0, 0, 0, 0.05)',
//                     drawBorder: false
//                 }
//             },
//             x: {
//                 grid: {
//                     display: false
//                 },
//                 ticks: {
//                     maxRotation: 45,
//                     minRotation: 45,
//                     font: {
//                         size: 10
//                     },
//                     color: '#6b7280'
//                 }
//             }
//         }
//     };

//     return (
//         <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
//             <div className="flex items-center gap-2 mb-4">
//                 <TrendingUp className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                     Mood Trends (Last 30 Days)
//                 </h3>
//             </div>

//             <div className="h-64">
//                 <Line data={chartData} options={options} />
//             </div>

//             {/* Legend */}
//             <div className="mt-4 flex items-center justify-center gap-6 text-sm">
//                 <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-full bg-[#f4873e]"></div>
//                     <span className="text-gray-600 dark:text-gray-400">Morning</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-full bg-[#89beab]"></div>
//                     <span className="text-gray-600 dark:text-gray-400">Evening</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MoodTrendChart;
import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Maps mood name to its numeric value (1-5 scale)
const MOOD_VALUE_MAP = {
    angry: 1,
    sad: 2,
    anxious: 2,
    tired: 2,
    neutral: 3,
    happy: 4,
    excited: 5
};

const MoodTrendChart = ({ data, highlightMood }) => {
    const chartRef = useRef(null);

    const labels = data.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const morningData = data.map(d => d.morning);
    const eveningData = data.map(d => d.evening);

    // When a mood is highlighted, compute which point indices match that mood value
    const highlightValue = highlightMood ? MOOD_VALUE_MAP[highlightMood] : null;

    const getPointRadius = (dataArr) =>
        dataArr.map(v => {
            if (!highlightValue) return 3;
            return Math.round(v) === highlightValue ? 8 : 2;
        });

    const getPointBg = (dataArr, baseColor) =>
        dataArr.map(v => {
            if (!highlightValue) return baseColor;
            return Math.round(v) === highlightValue ? '#facc15' : baseColor;
        });

    const getPointBorder = (dataArr) =>
        dataArr.map(v => {
            if (!highlightValue) return 'transparent';
            return Math.round(v) === highlightValue ? '#f4873e' : 'transparent';
        });

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Morning Mood',
                data: morningData,
                borderColor: '#f4873e',
                backgroundColor: 'rgba(244, 135, 62, 0.08)',
                tension: 0.4,
                fill: true,
                pointRadius: getPointRadius(morningData),
                pointHoverRadius: 7,
                pointBackgroundColor: getPointBg(morningData, '#f4873e'),
                pointBorderColor: getPointBorder(morningData),
                pointBorderWidth: 2,
                borderWidth: 2
            },
            {
                label: 'Evening Mood',
                data: eveningData,
                borderColor: '#89beab',
                backgroundColor: 'rgba(137, 190, 171, 0.08)',
                tension: 0.4,
                fill: true,
                pointRadius: getPointRadius(eveningData),
                pointHoverRadius: 7,
                pointBackgroundColor: getPointBg(eveningData, '#89beab'),
                pointBorderColor: getPointBorder(eveningData),
                pointBorderWidth: 2,
                borderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 13 },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            const moods = ['😢 Very Sad', '😔 Sad', '😐 Neutral', '🙂 Good', '😊 Great'];
                            const moodIndex = Math.round(context.parsed.y) - 1;
                            label += moods[moodIndex] || 'N/A';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        const moods = ['😢', '😔', '😐', '🙂', '😊'];
                        return moods[value - 1] || '';
                    },
                    font: { size: 16 },
                    color: '#6b7280'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: { size: 10 },
                    color: '#6b7280'
                }
            }
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                    Mood Trends (Last 30 Days)
                </h3>
            </div>

            {highlightMood && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-3 ml-7">
                    Highlighting days you felt <strong>{highlightMood}</strong> — shown as yellow dots
                </p>
            )}

            <div className="h-64">
                <Line ref={chartRef} data={chartData} options={options} />
            </div>

            {/* Custom legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f4873e]"></div>
                    <span className="text-gray-600 dark:text-gray-400">Morning</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#89beab]"></div>
                    <span className="text-gray-600 dark:text-gray-400">Evening</span>
                </div>
                {highlightMood && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span className="text-gray-600 dark:text-gray-400">{highlightMood} days</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodTrendChart;