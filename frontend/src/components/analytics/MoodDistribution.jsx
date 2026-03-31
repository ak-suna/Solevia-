// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Smile } from 'lucide-react';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const MoodDistribution = ({ data }) => {
//     const moodEmojis = {
//         happy: '😊',
//         excited: '🤩',
//         neutral: '😐',
//         sad: '😢',
//         angry: '😠',
//         anxious: '😰',
//         tired: '😴'
//     };

//     const moodColors = {
//         happy: '#10b981',
//         excited: '#f59e0b',
//         neutral: '#6b7280',
//         sad: '#3b82f6',
//         angry: '#ef4444',
//         anxious: '#8b5cf6',
//         tired: '#06b6d4'
//     };

//     const chartData = {
//         labels: Object.keys(data).map(mood => `${moodEmojis[mood]} ${mood.charAt(0).toUpperCase() + mood.slice(1)}`),
//         datasets: [
//             {
//                 data: Object.values(data),
//                 backgroundColor: Object.keys(data).map(mood => moodColors[mood]),
//                 borderColor: '#ffffff',
//                 borderWidth: 2,
//                 hoverOffset: 4
//             }
//         ]
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'bottom',
//                 labels: {
//                     font: {
//                         size: 11
//                     },
//                     color: '#6b7280',
//                     padding: 10,
//                     usePointStyle: true
//                 }
//             },
//             tooltip: {
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
//                         const label = context.label || '';
//                         const value = context.parsed || 0;
//                         return `${label}: ${value}%`;
//                     }
//                 }
//             }
//         },
//         cutout: '65%'
//     };

//     // Calculate most common mood
//     const maxMood = Object.entries(data).reduce((a, b) => a[1] > b[1] ? a : b, ['neutral', 0]);

//     return (
//         <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
//             <div className="flex items-center gap-2 mb-4">
//                 <Smile className="w-5 h-5 text-[#f4873e] dark:text-orange-400" />
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
//                     Mood Distribution
//                 </h3>
//             </div>

//             <div className="relative h-48">
//                 <Doughnut data={chartData} options={options} />

//                 {/* Center text */}
//                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                     <span className="text-3xl">{moodEmojis[maxMood[0]]}</span>
//                     <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Most Common</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MoodDistribution;
import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Smile } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const MoodDistribution = ({ data, selectedMood, onMoodSelect }) => {
    const chartRef = useRef(null);

    const moodEmojis = {
        happy: '😊',
        excited: '🤩',
        neutral: '😐',
        sad: '😢',
        angry: '😠',
        anxious: '😰',
        tired: '😴'
    };

    const moodColors = {
        happy: '#10b981',
        excited: '#f59e0b',
        neutral: '#6b7280',
        sad: '#3b82f6',
        angry: '#ef4444',
        anxious: '#8b5cf6',
        tired: '#06b6d4'
    };

    const moodKeys = Object.keys(data);

    const chartData = {
        labels: moodKeys.map(mood => `${moodEmojis[mood]} ${mood.charAt(0).toUpperCase() + mood.slice(1)}`),
        datasets: [
            {
                data: Object.values(data),
                backgroundColor: moodKeys.map(mood =>
                    selectedMood && selectedMood !== mood
                        ? moodColors[mood] + '55' // fade non-selected
                        : moodColors[mood]
                ),
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 6
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const clickedMood = moodKeys[index];
                // Toggle off if already selected
                onMoodSelect && onMoodSelect(selectedMood === clickedMood ? null : clickedMood);
            }
        },
        plugins: {
            legend: {
                display: false // we build a custom legend below
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 13 },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${label}: ${value}%`;
                    }
                }
            }
        },
        cutout: '62%'
    };

    const maxMood = Object.entries(data).reduce((a, b) => a[1] > b[1] ? a : b, ['neutral', 0]);

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Smile className="w-5 h-5 text-[#f4873e] dark:text-orange-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                    Mood Distribution
                </h3>
                {selectedMood && (
                    <button
                        onClick={() => onMoodSelect && onMoodSelect(null)}
                        className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Chart — taller now */}
            <div className="relative flex-1" style={{ minHeight: '220px' }}>
                <Doughnut ref={chartRef} data={chartData} options={options} />
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl">{selectedMood ? moodEmojis[selectedMood] : moodEmojis[maxMood[0]]}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {selectedMood ? selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1) : 'Most Common'}
                    </span>
                </div>
            </div>

            {/* Custom legend — clickable */}
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                {moodKeys.map(mood => (
                    <button
                        key={mood}
                        onClick={() => onMoodSelect && onMoodSelect(selectedMood === mood ? null : mood)}
                        className={`flex items-center gap-2 text-left transition-opacity ${selectedMood && selectedMood !== mood ? 'opacity-40' : 'opacity-100'
                            }`}
                    >
                        <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: moodColors[mood] }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                            {moodEmojis[mood]} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">{data[mood]}%</span>
                    </button>
                ))}
            </div>

            {selectedMood && (
                <p className="mt-3 text-xs text-center text-[#89beab] dark:text-teal-400">
                    Highlighted days in the mood trend above show when you felt {selectedMood}
                </p>
            )}
        </div>
    );
};

export default MoodDistribution;