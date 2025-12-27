import Agenda from "agenda";
import dotenv from "dotenv";
import notificationService from "../services/notificationService.js";
import { User } from "../models/User.js";
import Habit from "../models/Habit.js";
import { Mood } from "../models/Mood.js";

dotenv.config();

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
  processEvery: "1 minute",
  maxConcurrency: 20
});

agenda.define("send-habit-reminders", async (job) => {
  console.log("🔔 Running: send-habit-reminders");

  try {
    const users = await User.find({
      "notificationPreferences.habits.inApp": { $ne: false }
    });

    for (const user of users) {
      const habits = await Habit.find({
        user: user._id,
        completedToday: false
      });

      if (habits.length > 0) {
        const habitNames = habits.map(h => h.name).join(", ");
        
        await notificationService.createNotification({
          userId: user._id,
          type: "HABIT_REMINDER",
          title: "🎯 Time for Your Habits!",
          message: `Don't forget to complete: ${habitNames}`,
          data: {
            habitCount: habits.length,
            actionUrl: "/habits"
          }
        });
      }
    }

    console.log(`✅ Sent habit reminders to ${users.length} users`);
  } catch (error) {
    console.error("❌ Error in send-habit-reminders:", error);
  }
});

agenda.define("send-morning-mood-reminder", async (job) => {
  console.log("🔔 Running: send-morning-mood-reminder");

  try {
    const users = await User.find({
      "notificationPreferences.moods.inApp": { $ne: false }
    });

    for (const user of users) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingMood = await Mood.findOne({
        userId: user._id,
        period: "morning",
        date: { $gte: today }
      });

      if (!existingMood) {
        await notificationService.createNotification({
          userId: user._id,
          type: "MOOD_REMINDER_MORNING",
          title: "🌅 Good Morning!",
          message: "How are you feeling this morning? Log your mood to start your day!",
          data: {
            period: "morning",
            actionUrl: "/mood"
          }
        });
      }
    }

    console.log(`✅ Sent morning mood reminders`);
  } catch (error) {
    console.error("❌ Error in send-morning-mood-reminder:", error);
  }
});

agenda.define("send-evening-mood-reminder", async (job) => {
  console.log("🔔 Running: send-evening-mood-reminder");

  try {
    const users = await User.find({
      "notificationPreferences.moods.inApp": { $ne: false }
    });

    for (const user of users) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingMood = await Mood.findOne({
        userId: user._id,
        period: "evening",
        date: { $gte: today }
      });

      if (!existingMood) {
        await notificationService.createNotification({
          userId: user._id,
          type: "MOOD_REMINDER_EVENING",
          title: "🌙 Evening Check-in",
          message: "Take a moment to reflect on your day. How are you feeling?",
          data: {
            period: "evening",
            actionUrl: "/mood"
          }
        });
      }
    }

    console.log(`✅ Sent evening mood reminders`);
  } catch (error) {
    console.error("❌ Error in send-evening-mood-reminder:", error);
  }
});

agenda.define("check-streak-achievements", async (job) => {
  console.log("🔔 Running: check-streak-achievements");

  try {
    const users = await User.find({
      $or: [
        { "moodStreak.current": { $gte: 7 } },
        { "habitStreak.current": { $gte: 7 } }
      ]
    });

    for (const user of users) {
      const milestones = [7, 14, 30, 60, 100];

      if (milestones.includes(user.moodStreak.current)) {
        await notificationService.createNotification({
          userId: user._id,
          type: "STREAK_ACHIEVED",
          title: "🔥 Mood Streak Milestone!",
          message: `Amazing! You've logged your mood for ${user.moodStreak.current} days in a row!`,
          data: {
            streakType: "mood",
            streakCount: user.moodStreak.current,
            actionUrl: "/streaks"
          }
        });
      }

      if (milestones.includes(user.habitStreak.current)) {
        await notificationService.createNotification({
          userId: user._id,
          type: "STREAK_ACHIEVED",
          title: "💪 Habit Streak Milestone!",
          message: `Incredible! You've maintained your habits for ${user.habitStreak.current} days straight!`,
          data: {
            streakType: "habit",
            streakCount: user.habitStreak.current,
            actionUrl: "/streaks"
          }
        });
      }
    }

    console.log(`✅ Checked streak achievements`);
  } catch (error) {
    console.error("❌ Error in check-streak-achievements:", error);
  }
});

agenda.define("check-streaks-at-risk", async (job) => {
  console.log("🔔 Running: check-streaks-at-risk");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({
      $or: [
        { "moodStreak.current": { $gte: 3 } },
        { "habitStreak.current": { $gte: 3 } }
      ]
    });

    for (const user of users) {
      if (user.moodStreak.current >= 3) {
        const todayMood = await Mood.findOne({
          userId: user._id,
          date: { $gte: today }
        });

        if (!todayMood) {
          await notificationService.createNotification({
            userId: user._id,
            type: "STREAK_AT_RISK",
            title: "⚠️ Your Mood Streak is at Risk!",
            message: `Don't break your ${user.moodStreak.current}-day streak! Log your mood before midnight.`,
            data: {
              streakType: "mood",
              streakCount: user.moodStreak.current,
              actionUrl: "/mood"
            }
          });
        }
      }

      if (user.habitStreak.current >= 3) {
        const incompleteHabits = await Habit.countDocuments({
          user: user._id,
          completedToday: false
        });

        if (incompleteHabits > 0) {
          await notificationService.createNotification({
            userId: user._id,
            type: "STREAK_AT_RISK",
            title: "⚠️ Your Habit Streak is at Risk!",
            message: `Keep your ${user.habitStreak.current}-day streak alive! Complete your habits now.`,
            data: {
              streakType: "habit",
              streakCount: user.habitStreak.current,
              incompleteCount: incompleteHabits,
              actionUrl: "/habits"
            }
          });
        }
      }
    }

    console.log(`✅ Checked streaks at risk`);
  } catch (error) {
    console.error("❌ Error in check-streaks-at-risk:", error);
  }
});

agenda.define("cleanup-old-notifications", async (job) => {
  console.log("🔔 Running: cleanup-old-notifications");

  try {
    const deletedCount = await notificationService.deleteOldNotifications(30);
    console.log(`✅ Cleaned up ${deletedCount} old notifications`);
  } catch (error) {
    console.error("❌ Error in cleanup-old-notifications:", error);
  }
});

export async function startNotificationJobs() {
  try {
    await agenda.start();
    console.log("✅ Agenda started");

    await agenda.every("0 9 * * *", "send-habit-reminders");
    await agenda.every("0 8 * * *", "send-morning-mood-reminder");
    await agenda.every("0 20 * * *", "send-evening-mood-reminder");
    await agenda.every("0 22 * * *", "check-streak-achievements");
    await agenda.every("0 21 * * *", "check-streaks-at-risk");
    await agenda.every("0 2 * * *", "cleanup-old-notifications");

    console.log("✅ All notification jobs scheduled");
  } catch (error) {
    console.error("❌ Error starting notification jobs:", error);
    throw error;
  }
}

export async function stopNotificationJobs() {
  await agenda.stop();
  console.log("✅ Agenda stopped");
}

export default agenda;