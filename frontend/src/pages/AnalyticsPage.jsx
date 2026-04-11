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
import { BarChart2, Lightbulb } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMood, setSelectedMood] = useState(null);
    // const navigate = useNavigate();

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

    // Build actionable insight text based on real data
    const buildActionableInsights = () => {
        const insights = [...(analyticsData.insights || [])];

        if (analyticsData.lastJournalDate) {
            const lastJournal = new Date(analyticsData.lastJournalDate);
            const daysSince = Math.floor((Date.now() - lastJournal) / 86400000);
            if (daysSince >= 2) {
                insights.unshift(
                    `You haven't journaled in ${daysSince} days. Taking 2 minutes now could boost your mood score!`
                );
            }
        }

        if (analyticsData.thisWeek?.habitsCompleted < analyticsData.thisWeek?.habitsTotal * 0.5) {
            insights.push("You're below 50% habit completion this week — a quick check-in now can turn it around.");
        }

        return insights;
    };

    const actionableInsights = buildActionableInsights();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Sidebar - fixed positioning */}
            <Sidebar />

            {/* Main Content - with proper margin for sidebar */}
            <div className="ml-28 p-6">
                {/* Main Container - removed fixed height and internal scrolling */}
                <div className="bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)]">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5"
                        style={{ fontFamily: "Brasika" }}
                    >
                        <div className="flex items-center gap-3">
                            <BarChart2 className="w-8 h-8 text-[#89beab] dark:text-teal-400" />
                            <h1 className="text-3xl font-bold">
                                <span className="text-[#89beab] dark:text-teal-400">Your Wellness </span>
                                <span className="text-[#f4873e] dark:text-orange-400">Summary</span>
                            </h1>
                        </div>
                    </motion.div>

                    {/* Actionable Insights */}
                    {actionableInsights.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-5 mb-5 border-2 border-yellow-200 dark:border-yellow-800"
                        >
                            <div className="flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                                        Insights for you
                                    </h3>
                                    <div className="space-y-1.5">
                                        {actionableInsights.map((insight, index) => (
                                            <p key={index} className="text-yellow-800 dark:text-yellow-200 text-sm">
                                                • {insight}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Summary Cards */}
                    <SummaryCards
                        thisWeek={analyticsData.thisWeek}
                        thisMonth={analyticsData.thisMonth}
                    />

                    {/* Mood Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <MoodTrendChart
                            data={analyticsData.moodTrends}
                            highlightMood={selectedMood}
                        />
                    </motion.div>

                    {/* Heatmap + Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col"
                        >
                            <CalendarHeatmap data={analyticsData.habitHeatmap} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col"
                        >
                            <MoodDistribution
                                data={analyticsData.moodDistribution}
                                selectedMood={selectedMood}
                                onMoodSelect={setSelectedMood}
                            />
                        </motion.div>
                    </div>

                    {/* Activity Charts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                    >
                        <ActivityCharts
                            journalFrequency={analyticsData.journalFrequency}
                            habitCompletion={analyticsData.habitCompletionTrend}
                            dailyHabitBreakdown={analyticsData.dailyHabitBreakdown}
                            effortAllocation={analyticsData.effortAllocation}
                        />
                    </motion.div>

                    {/* Achievements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <AchievementBadges achievements={analyticsData.achievements} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;