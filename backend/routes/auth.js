
import express from "express";
import {
    loginUser,
    registerUser,
    verifyEmail,
    forgotPassword,
    resetPasswordController,
    refreshToken
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:code", verifyEmail);

// 🆕 NEW: Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPasswordController);

router.post("/refresh-token", refreshToken);

export default router;