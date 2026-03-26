import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { getAnalyticsSummary } from '../services/analyticsService';
import SummaryCards from '../components/analytics/SummaryCards';
import MoodTrendChart from '../components/analytics/MoodTrendChart';
import CalendarHeatmap from '../components/analytics/CalendarHeatmap';
import MoodDistribution from '../components/analytics/MoodDistribution';
import ActivityCharts from '../components/analytics/ActivityCharts';
import AchievementBadges from '../components/analytics/AchievementBadges';
import { BarChart2, TrendingUp, Lightbulb } from 'lucide-react';

const AnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await getAnalyticsSummary();
            setAnalyticsData(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
                <Sidebar />
                <div className="flex-1 ml-28 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#89beab] mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading your analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CENTER PANEL */}
            <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                    style={{ fontFamily: "Brasika" }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart2 className="w-8 h-8 text-[#89beab] dark:text-teal-400" />
                        <h1 className="text-3xl font-bold">
                            <span className="text-[#89beab] dark:text-teal-400">Your Wellness </span>
                            <span className="text-[#f4873e] dark:text-orange-400">Summary</span>
                        </h1>
                    </div>
                    {/* <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Here's how you're doing across all areas
                    </p> */}
                </motion.div>

                {/* Summary Cards */}
                <SummaryCards
                    thisWeek={analyticsData.thisWeek}
                    thisMonth={analyticsData.thisMonth}
                />

                {/* Insights Section */}
                {analyticsData.insights && analyticsData.insights.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-6 border-2 border-yellow-200 dark:border-yellow-800"
                    >
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                                    💡 Insights for You
                                </h3>
                                <div className="space-y-2">
                                    {analyticsData.insights.map((insight, index) => (
                                        <p key={index} className="text-yellow-800 dark:text-yellow-200 text-sm">
                                            • {insight}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Mood Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    <MoodTrendChart data={analyticsData.moodTrends} />
                </motion.div>

                {/* Heatmap and Distribution Side by Side */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <CalendarHeatmap data={analyticsData.habitHeatmap} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <MoodDistribution data={analyticsData.moodDistribution} />
                    </motion.div>
                </div>

                {/* Activity Charts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                >
                    <ActivityCharts
                        journalFrequency={analyticsData.journalFrequency}
                        habitCompletion={analyticsData.habitCompletionTrend}
                    />
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <AchievementBadges achievements={analyticsData.achievements} />
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;