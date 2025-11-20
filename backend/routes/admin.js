import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/users", authenticate, authorizeRole("admin"), async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Don't send passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Delete a user (Admin only)
router.delete("/users/:id", authenticate, authorizeRole("admin"), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Update user role (Admin only)
router.patch("/users/:id/role", authenticate, authorizeRole("admin"), async (req, res) => {
    try {
        const { role } = req.body;
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");
        
        res.status(200).json({ message: "Role updated", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update role" });
    }
});

export default router;