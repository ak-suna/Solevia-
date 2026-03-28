import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Activity } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ActivityCharts = ({ journalFrequency, habitCompletion }) => {
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

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-[#89beab] dark:text-teal-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                     Activity Overview
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Journal Frequency */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        📝 Journal Frequency
                    </h4>
                    <div className="h-48">
                        <Bar data={journalData} options={journalOptions} />
                    </div>
                </div>

                {/* Habit Completion */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        ✅ Habit Completion Rate
                    </h4>
                    <div className="h-48">
                        <Line data={habitData} options={habitOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityCharts;