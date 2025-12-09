// import express from "express";
// import { Mood } from "../models/Mood.js";
// // IMPORTANT: Replace with YOUR auth middleware path
// import { authenticateToken } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // POST: Save mood entry
// router.post("/", authenticateToken, async (req, res) => {
//     try {
//         const { mood, emoji, label, color, period } = req.body;
//         const userId = req.user.id; // or req.user._id depending on your setup
        
//         const startOfDay = new Date();
//         startOfDay.setHours(0, 0, 0, 0);
//         const endOfDay = new Date();
//         endOfDay.setHours(23, 59, 59, 999);
        
//         const existingMood = await Mood.findOne({
//             userId,
//             period,
//             date: { $gte: startOfDay, $lte: endOfDay }
//         });
        
//         if (existingMood) {
//             return res.status(400).json({ 
//                 message: `You've already logged your ${period} mood today` 
//             });
//         }
        
//         const moodEntry = new Mood({
//             userId,
//             mood,
//             emoji,
//             label,
//             color,
//             period,
//             date: new Date()
//         });
        
//         await moodEntry.save();
        
//         res.status(201).json({
//             message: "Mood logged successfully",
//             mood: moodEntry
//         });
        
//     } catch (error) {
//         console.error("Error saving mood:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // GET: Check today's mood status
// router.get("/today", authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.id;
        
//         const startOfDay = new Date();
//         startOfDay.setHours(0, 0, 0, 0);
//         const endOfDay = new Date();
//         endOfDay.setHours(23, 59, 59, 999);
        
//         const moods = await Mood.find({
//             userId,
//             date: { $gte: startOfDay, $lte: endOfDay }
//         });
        
//         const result = {
//             morning: moods.find(m => m.period === "morning") || null,
//             evening: moods.find(m => m.period === "evening") || null
//         };
        
//         res.json(result);
        
//     } catch (error) {
//         console.error("Error fetching today's moods:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// // GET: Get mood history (for calendar)
// router.get("/history", authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { startDate, endDate, limit = 30 } = req.query;
        
//         const query = { userId };
        
//         if (startDate && endDate) {
//             query.date = {
//                 $gte: new Date(startDate),
//                 $lte: new Date(endDate)
//             };
//         }
        
//         const moods = await Mood.find(query)
//             .sort({ date: -1 })
//             .limit(parseInt(limit));
        
//         res.json(moods);
        
//     } catch (error) {
//         console.error("Error fetching mood history:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// export default router;
import express from "express";
import { Mood } from "../models/Mood.js";
// UPDATE: Use YOUR auth middleware with correct name and path
import { authenticate } from "../middleware/authMiddleware.js"; // Change path if needed

const router = express.Router();

// POST: Save mood entry
router.post("/", authenticate, async (req, res) => {
    try {
        const { mood, emoji, label, color, period } = req.body;
        const userId = req.user.id; // or req.user._id depending on your setup
        
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
        
        res.status(201).json({
            message: "Mood logged successfully",
            mood: moodEntry
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
        const { startDate, endDate, limit = 30 } = req.query;
        
        const query = { userId };
        
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const moods = await Mood.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        res.json(moods);
        
    } catch (error) {
        console.error("Error fetching mood history:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
