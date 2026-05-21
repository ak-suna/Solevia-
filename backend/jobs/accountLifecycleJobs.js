import agenda from "./notificationJobs.js";
import { User } from "../models/User.js";
import { Mood } from "../models/Mood.js";
import Journal from "../models/Journal.js";
import Habit from "../models/Habit.js";
import Goal from "../models/Goal.js";
import { SupportGroup } from "../models/SupportGroup.js";
import HabitDay from "../models/HabitDay.js";

// Execute permanent deletion after 30-day grace period
agenda.define("execute-permanent-deletion", async (job) => {
    const { userId } = job.attrs.data;
    console.log(`[Agenda] Running execute-permanent-deletion for user: ${userId}`);

    try {
        const user = await User.findById(userId);

        if (!user) {
            console.log(`[Agenda] User ${userId} not found, aborting deletion job.`);
            return;
        }

        // Safety check: Ensure status is still pending_deletion
        if (user.accountStatus !== "pending_deletion") {
            console.log(`[Agenda] User ${userId} status is not pending_deletion (status: ${user.accountStatus}). Aborting deletion job.`);
            return;
        }

        // 1. HARD DELETE PRIVATE SOLO LOGS
        console.log(`[Agenda] Wiping private logs for user: ${userId}`);

        // Delete all moods
        await Mood.deleteMany({ userId: user._id });

        // Delete all journals
        await Journal.deleteMany({ user: user._id });

        // Delete all habits and their corresponding history logs
        await Habit.deleteMany({ user: user._id });
        await HabitDay.deleteMany({ user: user._id });

        // Delete all goals
        await Goal.deleteMany({ user: user._id });

        // 2. SOFT DELETE COMMUNITY LOGS
        // Remove user from moderated groups
        console.log(`[Agenda] Removing user ${userId} from moderated groups`);
        await SupportGroup.updateMany(
            { moderators: user._id },
            { $pull: { moderators: user._id } }
        );

        // We leave Post and Comment models alone. When their populated 'userId' returns null,
        // the controllers will automatically anonymize them as '[Deleted User]'.

        // 3. FINAL PROFILE DELETE
        console.log(`[Agenda] Deleting core User document for: ${userId}`);
        await User.findByIdAndDelete(user._id);

        console.log(`✅ [Agenda] Successfully completed permanent deletion for user: ${userId}`);
    } catch (error) {
        console.error(`❌ [Agenda] Error executing permanent deletion for user ${userId}:`, error);
        throw error;
    }
});

export const scheduleAccountDeletion = async (userId, targetDate) => {
    // Schedule a specific job to run at the targetDate
    await agenda.schedule(targetDate, "execute-permanent-deletion", { userId });
    console.log(`✅ [Agenda] Scheduled deletion for user ${userId} at ${targetDate}`);
};

export const cancelAccountDeletionJob = async (userId) => {
    // Cancel any pending deletion jobs for this user
    await agenda.cancel({ name: "execute-permanent-deletion", "data.userId": userId });
    console.log(`✅ [Agenda] Cancelled scheduled deletion for user ${userId}`);
};
