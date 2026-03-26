import { Mood } from "../models/Mood.js";
import Habit from "../models/Habit.js";
import Journal from "../models/Journal.js";
import Goal from "../models/Goal.js";

// Helper function to get date range
const getDateRange = (days) => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate };
};

// Helper function to get week boundaries
const getWeekBoundaries = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
};

// Helper function to get month boundaries
const getMonthBoundaries = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return { startOfMonth, endOfMonth };
};

// Calculate mood average (happy=5, excited=5, neutral=3, sad=1, angry=1, anxious=2, tired=2)
const moodToScore = (mood) => {
    const scores = {
        happy: 5,
        excited: 5,
        neutral: 3,
        sad: 1,
        angry: 1,
        anxious: 2,
        tired: 2
    };
    return scores[mood] || 3;
};

// Main analytics summary endpoint
export const getAnalyticsSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get date ranges
        const { startOfWeek, endOfWeek } = getWeekBoundaries();
        const { startOfMonth, endOfMonth } = getMonthBoundaries();
        const { startDate: start30Days } = getDateRange(30);
        const { startDate: start90Days } = getDateRange(90);

        // ===== THIS WEEK STATS =====
        const thisWeekMoods = await Mood.find({
            userId,
            date: { $gte: startOfWeek, $lte: endOfWeek }
        });

        const thisWeekHabits = await Habit.find({
            user: userId,
            habitDate: { $gte: startOfWeek, $lte: endOfWeek },
            isArchived: false
        });

        const thisWeekJournals = await Journal.countDocuments({
            user: userId,
            date: { $gte: startOfWeek, $lte: endOfWeek }
        });

        const thisWeekGoals = await Goal.find({
            user: userId,
            status: 'completed',
            updatedAt: { $gte: startOfWeek, $lte: endOfWeek }
        });

        // Calculate this week stats
        const habitsCompleted = thisWeekHabits.filter(h => h.completedToday).length;
        const habitsTotal = thisWeekHabits.length;

        const avgMoodThisWeek = thisWeekMoods.length > 0
            ? (thisWeekMoods.reduce((sum, m) => sum + moodToScore(m.mood), 0) / thisWeekMoods.length).toFixed(1)
            : 0;

        // ===== THIS MONTH STATS =====
        const thisMonthJournals = await Journal.countDocuments({
            user: userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const thisMonthGoals = await Goal.find({
            user: userId,
            status: 'completed',
            updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const thisMonthHabits = await Habit.find({
            user: userId,
            habitDate: { $gte: startOfMonth, $lte: endOfMonth },
            isArchived: false
        });

        const thisMonthMoods = await Mood.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const avgMoodThisMonth = thisMonthMoods.length > 0
            ? (thisMonthMoods.reduce((sum, m) => sum + moodToScore(m.mood), 0) / thisMonthMoods.length).toFixed(1)
            : 0;

        // ===== MOOD TRENDS (30 DAYS) =====
        const moodTrends = await Mood.find({
            userId,
            date: { $gte: start30Days }
        }).sort({ date: 1 });

        // Group by date
        const moodByDate = {};
        moodTrends.forEach(mood => {
            const dateKey = mood.date.toISOString().split('T')[0];
            if (!moodByDate[dateKey]) {
                moodByDate[dateKey] = { date: dateKey, morning: null, evening: null };
            }
            if (mood.period === 'morning') {
                moodByDate[dateKey].morning = moodToScore(mood.mood);
            } else {
                moodByDate[dateKey].evening = moodToScore(mood.mood);
            }
        });

        const moodTrendsArray = Object.values(moodByDate);

        // ===== HABIT HEATMAP (90 DAYS) =====
        const habitHeatmap = [];
        const habits90Days = await Habit.find({
            user: userId,
            habitDate: { $gte: start90Days },
            isArchived: false
        });

        // Group habits by date
        const habitsByDate = {};
        habits90Days.forEach(habit => {
            const dateKey = habit.habitDate.toISOString().split('T')[0];
            if (!habitsByDate[dateKey]) {
                habitsByDate[dateKey] = { total: 0, completed: 0 };
            }
            habitsByDate[dateKey].total++;
            if (habit.completedToday) {
                habitsByDate[dateKey].completed++;
            }
        });

        // Create array for last 90 days
        for (let i = 89; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];

            const dayData = habitsByDate[dateKey] || { total: 0, completed: 0 };
            const completion = dayData.total > 0
                ? (dayData.completed / dayData.total)
                : 0;

            habitHeatmap.push({
                date: dateKey,
                completion: parseFloat(completion.toFixed(2))
            });
        }

        // ===== MOOD DISTRIBUTION =====
        const allMoods = await Mood.find({ userId });
        const moodCounts = {
            happy: 0,
            excited: 0,
            neutral: 0,
            sad: 0,
            angry: 0,
            anxious: 0,
            tired: 0
        };

        allMoods.forEach(mood => {
            if (moodCounts.hasOwnProperty(mood.mood)) {
                moodCounts[mood.mood]++;
            }
        });

        const totalMoods = allMoods.length;
        const moodDistribution = {};
        Object.keys(moodCounts).forEach(mood => {
            moodDistribution[mood] = totalMoods > 0
                ? Math.round((moodCounts[mood] / totalMoods) * 100)
                : 0;
        });

        // ===== JOURNAL FREQUENCY (Last 4 weeks) =====
        const journalFrequency = [];
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - ((i + 1) * 7));
            weekStart.setHours(0, 0, 0, 0);

            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() - (i * 7));
            weekEnd.setHours(23, 59, 59, 999);

            const count = await Journal.countDocuments({
                user: userId,
                date: { $gte: weekStart, $lte: weekEnd }
            });

            journalFrequency.push({
                week: `Week ${4 - i}`,
                count
            });
        }

        // ===== HABIT COMPLETION TREND (Last 4 weeks) =====
        const habitCompletionTrend = [];
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - ((i + 1) * 7));
            weekStart.setHours(0, 0, 0, 0);

            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() - (i * 7));
            weekEnd.setHours(23, 59, 59, 999);

            const weekHabits = await Habit.find({
                user: userId,
                habitDate: { $gte: weekStart, $lte: weekEnd },
                isArchived: false
            });

            const completed = weekHabits.filter(h => h.completedToday).length;
            const total = weekHabits.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            habitCompletionTrend.push({
                week: `Week ${4 - i}`,
                percentage
            });
        }

        // ===== ACHIEVEMENTS =====
        const allHabits = await Habit.find({ user: userId, isArchived: false });
        const allJournals = await Journal.find({ user: userId });
        const allGoalsCompleted = await Goal.find({ user: userId, status: 'completed' });

        // Calculate streaks from backend service
        const streaksResponse = await fetch(`http://localhost:5000/api/mood/streaks`, {
            headers: { Authorization: req.headers.authorization }
        });
        const streaks = await streaksResponse.json();

        const achievements = [
            {
                id: '7-day-streak',
                name: '7-Day Streak',
                description: 'Check in for 7 consecutive days',
                icon: '🔥',
                unlocked: streaks.moodStreak.current >= 7,
                progress: Math.min(streaks.moodStreak.current, 7),
                target: 7
            },
            {
                id: 'journal-pro',
                name: 'Journal Pro',
                description: 'Write 30 journal entries',
                icon: '📝',
                unlocked: allJournals.length >= 30,
                progress: Math.min(allJournals.length, 30),
                target: 30
            },
            {
                id: 'goal-master',
                name: 'Goal Master',
                description: 'Complete 5 goals',
                icon: '🎯',
                unlocked: allGoalsCompleted.length >= 5,
                progress: Math.min(allGoalsCompleted.length, 5),
                target: 5
            },
            {
                id: 'habit-hero',
                name: 'Habit Hero',
                description: '100% habit completion for a week',
                icon: '💪',
                unlocked: habitCompletionTrend.some(w => w.percentage === 100),
                progress: Math.max(...habitCompletionTrend.map(w => w.percentage), 0),
                target: 100
            },
            {
                id: 'consistency-king',
                name: 'Consistency King',
                description: '30-day mood check-in streak',
                icon: '👑',
                unlocked: streaks.moodStreak.best >= 30,
                progress: Math.min(streaks.moodStreak.best, 30),
                target: 30
            }
        ];

        // ===== INSIGHTS =====
        const insights = [];

        // Mood insights
        const happyPercentage = moodDistribution.happy || 0;
        const sadPercentage = moodDistribution.sad || 0;

        if (happyPercentage > 50) {
            insights.push("You've been feeling great lately! Keep it up! 😊");
        } else if (sadPercentage > 30) {
            insights.push("Consider talking to someone if you're feeling down. 💙");
        }

        // Streak insights
        if (streaks.moodStreak.current > 0) {
            insights.push(`Amazing! You're on a ${streaks.moodStreak.current}-day check-in streak! 🔥`);
        }

        // Habit insights
        const thisWeekCompletion = habitsTotal > 0
            ? Math.round((habitsCompleted / habitsTotal) * 100)
            : 0;

        if (thisWeekCompletion >= 80) {
            insights.push("You're crushing your habits this week! 💪");
        } else if (thisWeekCompletion < 50) {
            insights.push("Don't give up! Small steps lead to big changes. 🌱");
        }

        // Journal insights
        if (thisWeekJournals >= 5) {
            insights.push("You've been journaling consistently! Great for reflection! 📝");
        }

        // Default insight if no specific ones
        if (insights.length === 0) {
            insights.push("Keep tracking your progress. Every day is a new opportunity! ✨");
        }

        // ===== RESPONSE =====
        res.json({
            thisWeek: {
                moodCheckins: thisWeekMoods.length,
                habitsCompleted,
                habitsTotal,
                journalEntries: thisWeekJournals,
                avgMood: parseFloat(avgMoodThisWeek),
                goalsCompleted: thisWeekGoals.length
            },
            thisMonth: {
                journalEntries: thisMonthJournals,
                goalsCompleted: thisMonthGoals.length,
                habitsCompleted: thisMonthHabits.filter(h => h.completedToday).length,
                avgMood: parseFloat(avgMoodThisMonth)
            },
            moodTrends: moodTrendsArray,
            habitHeatmap,
            moodDistribution,
            journalFrequency,
            habitCompletionTrend,
            achievements,
            insights,
            streaks: {
                mood: streaks.moodStreak,
                habit: streaks.habitStreak
            }
        });

    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({
            message: "Failed to fetch analytics",
            error: error.message
        });
    }
};