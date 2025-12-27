import express from "express";
import notificationService from "../services/notificationService.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const result = await notificationService.getUserNotifications(
      req.user.userId || req.user.id,
      {
        page: parseInt(page),
        limit: parseInt(limit),
        unreadOnly: unreadOnly === "true"
      }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
});

router.get("/unread-count", async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.userId || req.user.id);

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error("❌ Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count"
    });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.userId || req.user.id
    );

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

router.patch("/mark-all-read", async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.userId || req.user.id);

    res.json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("❌ Error marking all as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all as read"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await notificationService.deleteNotification(
      req.params.id,
      req.user.userId || req.user.id
    );

    res.json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/preferences", async (req, res) => {
  try {
    const user = await User.findById(req.user.userId || req.user.id).select("notificationPreferences");

    const preferences = user.notificationPreferences || {
      habits: { inApp: true, email: true },
      moods: { inApp: true, email: false },
      streaks: { inApp: true, email: false },
      community: { inApp: true, email: false }
    };

    res.json({
      success: true,
      preferences
    });
  } catch (error) {
    console.error("❌ Error fetching preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch preferences"
    });
  }
});

router.put("/preferences", async (req, res) => {
  try {
    const { habits, moods, streaks, community } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId || req.user.id,
      {
        notificationPreferences: {
          habits: habits || { inApp: true, email: true },
          moods: moods || { inApp: true, email: false },
          streaks: streaks || { inApp: true, email: false },
          community: community || { inApp: true, email: false }
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Preferences updated successfully",
      preferences: updatedUser.notificationPreferences
    });
  } catch (error) {
    console.error("❌ Error updating preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update preferences"
    });
  }
});

router.post("/test", async (req, res) => {
  try {
    const notification = await notificationService.createNotification({
      userId: req.user.userId || req.user.id,
      type: "SYSTEM_ALERT",
      title: "🧪 Test Notification",
      message: "This is a test notification. Your system is working correctly!",
      data: { test: true }
    });

    res.json({
      success: true,
      message: "Test notification sent",
      notification
    });
  } catch (error) {
    console.error("❌ Error sending test notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test notification"
    });
  }
});

export default router;