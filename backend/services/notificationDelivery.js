import { sendNotificationEmail } from "../utils/sendEmail.js";
import { getIO } from "../sockets/notificationSocket.js";

export async function deliverNotification(notification, user) {
  const deliveryResults = {
    inApp: false,
    email: false
  };

  if (notification.channels.inApp) {
    deliveryResults.inApp = await deliverInAppNotification(notification, user);
  }

  if (notification.channels.email) {
    deliveryResults.email = await deliverEmailNotification(notification, user);
  }

  console.log(`📬 Notification ${notification._id} delivery:`, deliveryResults);
  return deliveryResults;
}

async function deliverInAppNotification(notification, user) {
  try {
    if (!user.socketId) {
      console.log(`⚠️ User ${user._id} is offline (no socketId)`);
      return false;
    }

    const io = getIO();
    if (!io) {
      console.error("❌ Socket.io instance not initialized");
      return false;
    }

    io.to(user.socketId).emit("notification", {
      _id: notification._id,
      type: notification.type,
      priority: notification.priority,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      createdAt: notification.createdAt
    });

    await notification.markAsDelivered("inApp");
    
    console.log(`✅ In-app notification delivered to user ${user._id}`);
    return true;
  } catch (error) {
    console.error("❌ Error delivering in-app notification:", error);
    return false;
  }
}

async function deliverEmailNotification(notification, user) {
  try {
    await sendNotificationEmail(user, notification);
    await notification.markAsDelivered("email");
    
    console.log(`✅ Email notification sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email notification:", error);
    return false;
  }
}

export async function retryNotificationDelivery(notificationId) {
  const Notification = (await import("../models/Notification.js")).default;
  const { User } = await import("../models/User.js");

  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }

  const user = await User.findById(notification.userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await deliverNotification(notification, user);
}