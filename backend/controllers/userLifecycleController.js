import { User } from "../models/User.js";
import { scheduleAccountDeletion, cancelAccountDeletionJob } from "../jobs/accountLifecycleJobs.js";
import { sendAccountDeactivatedEmail, sendAccountDeletionRequestedEmail } from "../utils/sendEmail.js";

// POST /api/users/deactivate
export const deactivateAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.accountStatus = "deactivated";
        user.statusChangedAt = new Date();
        
        // Turn off all email and in-app notifications
        user.notificationPreferences = {
            habits: { inApp: false, email: false },
            moods: { inApp: false, email: false },
            streaks: { inApp: false, email: false },
            journals: { inApp: false, email: false },
            community: { inApp: false, email: false },
            system: { inApp: false, email: false }
        };

        await user.save();

        // Send confirmation email (does not throw if fails)
        await sendAccountDeactivatedEmail(user);

        res.status(200).json({ message: "Account successfully deactivated." });
    } catch (error) {
        console.error("Error deactivating account:", error);
        res.status(500).json({ error: "Failed to deactivate account" });
    }
};

// POST /api/users/reactivate
// NOTE: This uses the body email/password to confirm identity since they are logged out.
import { verifyUser } from "../services/userService.js";
import { generateToken } from "../utils/generateToken.js";

export const reactivateAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verify credentials first
        const user = await verifyUser({ email, password });

        if (user.disabled) {
            return res.status(403).json({ error: "Your account is disabled." });
        }

        if (user.accountStatus !== "deactivated") {
            return res.status(400).json({ error: "Account is not in a deactivated state." });
        }

        // Restore active status
        user.accountStatus = "active";
        user.statusChangedAt = null;

        // Restore default notifications or let them re-enable manually
        user.notificationPreferences = {
            habits: { inApp: true, email: true },
            moods: { inApp: true, email: false },
            streaks: { inApp: true, email: false },
            journals: { inApp: true, email: false },
            community: { inApp: true, email: false },
            system: { inApp: true, email: true }
        };

        await user.save();

        const token = generateToken({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified
        });

        res.status(200).json({ 
            message: "Account successfully reactivated. Welcome back!",
            token: token,
            role: user.role,
            isVerified: user.isVerified
        });
    } catch (error) {
        console.error("Error reactivating account:", error);
        res.status(400).json({ error: error.message });
    }
};

// POST /api/users/request-deletion
export const requestAccountDeletion = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Calculate expiration date (30 days from now)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        user.accountStatus = "pending_deletion";
        user.statusChangedAt = new Date();
        user.deletionGracePeriodExpiresAt = expirationDate;

        await user.save();

        // Schedule Agenda Job
        await scheduleAccountDeletion(user._id, expirationDate);

        // Send confirmation email
        await sendAccountDeletionRequestedEmail(user, expirationDate);

        res.status(200).json({ 
            message: "Account deletion requested. Your account will be permanently deleted in 30 days.",
            expiresAt: expirationDate
        });
    } catch (error) {
        console.error("Error requesting account deletion:", error);
        res.status(500).json({ error: "Failed to request account deletion" });
    }
};

// POST /api/users/cancel-deletion
// Requires credentials to confirm cancellation since they are logged out.
export const cancelAccountDeletion = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verify credentials first
        const user = await verifyUser({ email, password });

        if (user.disabled) {
            return res.status(403).json({ error: "Your account is disabled." });
        }

        if (user.accountStatus !== "pending_deletion") {
            return res.status(400).json({ error: "Account is not scheduled for deletion." });
        }

        // Cancel Agenda Job
        await cancelAccountDeletionJob(user._id);

        // Restore active status
        user.accountStatus = "active";
        user.statusChangedAt = null;
        user.deletionGracePeriodExpiresAt = null;

        await user.save();

        const token = generateToken({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified
        });

        res.status(200).json({ 
            message: "Deletion request cancelled. Your account is fully restored.",
            token: token,
            role: user.role,
            isVerified: user.isVerified
        });
    } catch (error) {
        console.error("Error cancelling account deletion:", error);
        res.status(400).json({ error: error.message });
    }
};
