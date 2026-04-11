import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import {
    getAllChallenges,
    getChallengeById,
    joinChallenge,
    leaveChallenge,
    completeToday,
    getPastChallenges,
    getChallengeFeed,
    createChallengeFeedPost,
    reactToChallengeFeedPost,
    createTemplate,
    getAllTemplates,
    updateTemplate,
    deleteTemplate
} from "../controllers/challengeController.js";

const router = express.Router();

router.get("/user", authenticate, getAllChallenges);
// Admin template routes
router.post("/admin/templates", authenticate, authorizeRole("admin"), createTemplate);
router.get("/admin/templates", authenticate, authorizeRole("admin"), getAllTemplates);
router.patch("/admin/templates/:id", authenticate, authorizeRole("admin"), updateTemplate);
router.delete("/admin/templates/:id", authenticate, authorizeRole("admin"), deleteTemplate);

// User challenge routes
router.get("/past", authenticate, getPastChallenges);
router.get("/", authenticate, getAllChallenges);
router.get("/:id", authenticate, getChallengeById);
router.post("/:id/join", authenticate, joinChallenge);
router.post("/:id/leave", authenticate, leaveChallenge);
router.post("/:id/complete-today", authenticate, completeToday);

// Challenge feed routes
router.get("/:id/feed", authenticate, getChallengeFeed);
router.post("/:id/feed", authenticate, createChallengeFeedPost);
router.post("/:id/feed/:postId/react", authenticate, reactToChallengeFeedPost);

export default router;