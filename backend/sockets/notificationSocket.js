import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY);
      
      socket.userId = decoded.userId || decoded.id;
      socket.userEmail = decoded.email;

      next();
    } catch (error) {
      console.error("❌ Socket authentication failed:", error.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`✅ User connected: ${socket.userId} (Socket ID: ${socket.id})`);

    try {
      await User.findByIdAndUpdate(socket.userId, { 
        socketId: socket.id 
      });

      socket.join(`user:${socket.userId}`);

      const Notification = (await import("../models/Notification.js")).default;
      const unreadCount = await Notification.getUnreadCount(socket.userId);
      socket.emit("unread-count", unreadCount);

      socket.on("notification-received", async (notificationId) => {
        console.log(`📬 Notification ${notificationId} acknowledged by user ${socket.userId}`);
      });

      socket.on("mark-as-read", async (notificationId) => {
        try {
          const notificationService = (await import("../services/notificationService.js")).default;
          await notificationService.markAsRead(notificationId, socket.userId);
          
          const newUnreadCount = await Notification.getUnreadCount(socket.userId);
          socket.emit("unread-count", newUnreadCount);
        } catch (error) {
          console.error("❌ Error marking notification as read:", error);
        }
      });

      socket.on("disconnect", async () => {
        console.log(`❌ User disconnected: ${socket.userId}`);
        
        try {
          await User.findByIdAndUpdate(socket.userId, { 
            socketId: null 
          });
        } catch (error) {
          console.error("❌ Error updating user on disconnect:", error);
        }
      });

    } catch (error) {
      console.error("❌ Error in socket connection handler:", error);
    }
  });

  console.log("🔌 Socket.io initialized");
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

export async function emitToUser(userId, event, data) {
  try {
    const user = await User.findById(userId);
    if (user && user.socketId) {
      io.to(user.socketId).emit(event, data);
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Error emitting to user:", error);
    return false;
  }
}

export function broadcastToAll(event, data) {
  io.emit(event, data);
}
