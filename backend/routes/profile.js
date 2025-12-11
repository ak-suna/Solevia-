import express from "express";
import { getProfile, updateProfile, changeUserPassword } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All profile routes require authentication
router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);
router.post("/change-password", authenticate, changeUserPassword);

export default router;