// backend/services/notificationService.js
import Notification from "../models/Notification.js";
import { User } from "../models/User.js";
import { getNotificationConfig, calculateExpiryDate } from "../utils/notificationTypes.js";
import { deliverNotification } from "./notificationDelivery.js";

class NotificationService {
  async createNotification({
    userId,
    type,
    title,
    message,
    data = {},
    channels = null,
    deliverNow = true
  }) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // ✅ TIME-BASED CHECK FOR MOOD REMINDERS
      if (type === "MOOD_REMINDER_MORNING" || type === "MOOD_REMINDER_EVENING") {
        const shouldSend = this.shouldSendMoodReminder(type);
        if (!shouldSend) {
          console.log(`⏰ Skipping ${type} - outside time window`);
          return null; // Don't create notification if outside time window
        }
      }

      const config = getNotificationConfig(type);
      const finalChannels = channels || this.determineChannels(type, user, config);
      const expiresAt = calculateExpiryDate(config.expiresInDays);

      const notification = await Notification.create({
        userId,
        type,
        priority: config.priority,
        title,
        message,
        data,
        channels: finalChannels,
        expiresAt
      });

      console.log(`✅ Notification created: ${type} for user ${userId}`);

      if (deliverNow) {
        await deliverNotification(notification, user);
      }

      return notification;
    } catch (error) {
      console.error("❌ Error creating notification:", error);
      throw error;
    }
  }

  // ✅ NEW METHOD: Check if mood reminder should be sent based on time
  shouldSendMoodReminder(type) {
    const now = new Date();
    const currentHour = now.getHours();

    if (type === "MOOD_REMINDER_MORNING") {
      // Morning: 6 AM to 12 PM (6-11)
      return currentHour >= 6 && currentHour < 12;
    } else if (type === "MOOD_REMINDER_EVENING") {
      // Evening: 5 PM to 11 PM (17-22)
      return currentHour >= 17 && currentHour < 23;
    }

    return true; // For other types, always send
  }

  determineChannels(type, user, config) {
    let channels = { ...config.defaultChannels };

    if (user.notificationPreferences) {
      const typeCategory = this.getTypeCategory(type);
      const userPref = user.notificationPreferences[typeCategory];

      if (userPref) {
        channels.inApp = userPref.inApp !== undefined ? userPref.inApp : channels.inApp;
        channels.email = userPref.email !== undefined ? userPref.email : channels.email;
      }
    }

    return channels;
  }

  getTypeCategory(type) {
    if (type.includes("HABIT")) return "habits";
    if (type.includes("MOOD")) return "moods";
    if (type.includes("JOURNAL")) return "journals";
    if (type.includes("STREAK")) return "streaks";
    if (type.includes("COMMUNITY") || type.includes("GROUP") || type.includes("PEER")) return "community";
    return "system";
  }

  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false }) {
    const query = { userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(userId);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    };
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return await notification.markAsRead();
  }

  async markAllAsRead(userId) {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    );

    return result;
  }

  async deleteNotification(notificationId, userId) {
    const result = await Notification.deleteOne({
      _id: notificationId,
      userId
    });

    if (result.deletedCount === 0) {
      throw new Error("Notification not found");
    }

    return { success: true };
  }

  async deleteOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      read: true
    });

    console.log(`🗑️ Deleted ${result.deletedCount} old notifications`);
    return result.deletedCount;
  }

  async getUnreadCount(userId) {
    return await Notification.getUnreadCount(userId);
  }

  async createBulkNotifications(userIds, notificationData) {
    const notifications = [];

    for (const userId of userIds) {
      try {
        const notification = await this.createNotification({
          userId,
          ...notificationData
        });
        
        // ✅ Only add if notification was created (not null)
        if (notification) {
          notifications.push(notification);
        }
      } catch (error) {
        console.error(`❌ Failed to create notification for user ${userId}:`, error);
      }
    }

    return notifications;
  }
}


export default new NotificationService();