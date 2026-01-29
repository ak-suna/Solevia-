import express from "express";
import {
    getAllChallenges,
    getChallengeById,
    getUserChallenges,
    joinChallenge,
    leaveChallenge,
    updateChallengeProgress,
    getChallengeLeaderboard,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getChallengeStats
} from "../controllers/challengeController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/authenticated routes
router.get("/", authenticate, getAllChallenges); // Get all challenges with filters
router.get("/user", authenticate, getUserChallenges); // Get user's joined challenges
router.get("/:challengeId", authenticate, getChallengeById); // Get single challenge
router.get("/:challengeId/leaderboard", authenticate, getChallengeLeaderboard); // Get leaderboard

// Join/Leave challenge
router.post("/:challengeId/join", authenticate, joinChallenge); // Join a challenge
router.post("/:challengeId/leave", authenticate, leaveChallenge); // Leave a challenge

// Progress tracking
router.post("/:challengeId/progress", authenticate, updateChallengeProgress); // Update progress

// Admin routes
router.post("/", authenticate, authorizeRole("admin"), createChallenge); // Create new challenge
router.put("/:challengeId", authenticate, authorizeRole("admin"), updateChallenge); // Update challenge
router.delete("/:challengeId", authenticate, authorizeRole("admin"), deleteChallenge); // Delete challenge
router.get("/:challengeId/stats", authenticate, authorizeRole("admin"), getChallengeStats); // Get stats

export default router;