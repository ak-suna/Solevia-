import express from "express";
import { Mood } from "../models/Mood.js";
import { authenticate } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";
import { updateChallengeProgress } from "../utils/challengeUtils.js";

const router = express.Router();

// POST: Save mood entry AND UPDATE STREAK
router.post("/", authenticate, async (req, res) => {
    try {
        const { mood, emoji, label, color, period } = req.body;
        const userId = req.user.id;
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        const existingMood = await Mood.findOne({
            userId,
            period,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        
        if (existingMood) {
            return res.status(400).json({ 
                message: `You've already logged your ${period} mood today` 
            });
        }
        
        const moodEntry = new Mood({
            userId,
            mood,
            emoji,
            label,
            color,
            period,
            date: new Date()
        });
        
        await moodEntry.save();
        
        // UPDATE CHALLENGE PROGRESS
        const todayStr = new Date().toISOString().split("T")[0];
        await updateChallengeProgress(userId, "mood", todayStr);
        
        // UPDATE MOOD STREAK
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        
        const today = new Date().setHours(0, 0, 0, 0);
        const lastEntry = user.moodStreak.lastEntryDate 
            ? new Date(user.moodStreak.lastEntryDate).setHours(0, 0, 0, 0) 
            : null;
        
        // If first entry of the day
        if (!lastEntry || lastEntry < today) {
            const oneDay = 86400000;
            const yesterday = today - oneDay;
            const dayBeforeYesterday = today - 2 * oneDay;

            if (!lastEntry) {
                // First ever entry
                user.moodStreak.current = 1;
            } else if (lastEntry === yesterday || lastEntry === dayBeforeYesterday) {
                // Logged yesterday or missed one day (grace period) - continue streak
                user.moodStreak.current += 1;
                if (user.moodStreak.current > user.moodStreak.best) {
                    user.moodStreak.best = user.moodStreak.current;
                }
            } else if (today - lastEntry > 2 * oneDay) {
                // Missed two or more consecutive days - reset
                user.moodStreak.current = 1;
            }

            user.moodStreak.lastEntryDate = new Date();
            await user.save();
        }
        
        res.status(201).json({
            message: "Mood logged successfully",
            mood: moodEntry,
            moodStreak: user.moodStreak
        });
        
    } catch (error) {
        console.error("Error saving mood:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET: Check today's mood status
router.get("/today", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        const moods = await Mood.find({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        
        const result = {
            morning: moods.find(m => m.period === "morning") || null,
            evening: moods.find(m => m.period === "evening") || null
        };
        
        res.json(result);
        
    } catch (error) {
        console.error("Error fetching today's moods:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET: Get mood history (for calendar)
router.get("/history", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate, limit = 90 } = req.query;
        
        const query = { userId };
        
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            query.date = { $gte: ninetyDaysAgo };
        }
        
        const moods = await Mood.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        const groupedMoods = {};
        
        moods.forEach(mood => {
            const dateStr = mood.date.toISOString().split('T')[0];
            
            if (!groupedMoods[dateStr]) {
                groupedMoods[dateStr] = {
                    date: mood.date,
                    morning: null,
                    evening: null
                };
            }
            
            const moodData = {
                emoji: mood.emoji,
                label: mood.label,
                value: mood.mood,
                color: mood.color
            };
            
            if (mood.period === "morning") {
                groupedMoods[dateStr].morning = moodData;
            } else if (mood.period === "evening") {
                groupedMoods[dateStr].evening = moodData;
            }
        });
        
        const result = Object.values(groupedMoods);
        
        res.json(result);
        
    } catch (error) {
        console.error("Error fetching mood history:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ADD THIS NEW ROUTE - Get user streaks
router.get("/streaks", authenticate, async (req, res) => {
    try {
        const User = mongoose.model('User');
        const user = await User.findById(req.user.id);
        
        res.json({
            moodStreak: user.moodStreak || { current: 0, best: 0 },
            habitStreak: user.habitStreak || { current: 0, best: 0 }
        });
    } catch (error) {
        console.error("Error fetching streaks:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;