import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: false, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    date: { type: Date, default: Date.now },

    // moderator role
    role: {
        type: String,
        enum: ["user", "moderator", "admin"],
        default: "user"
    },
    points: {
        type: Number,
        default: 0
    },

    // Track which groups user moderates
    moderatedGroups: [{
        type: Schema.Types.ObjectId,
        ref: "SupportGroup"
    }],

    // Moderator promotion tracking
    promotedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    promotedAt: {
        type: Date,
        default: null
    },

    moodStreak: {
        current: { type: Number, default: 0 },
        best: { type: Number, default: 0 },
        lastEntryDate: { type: Date, default: null }
    },

    habitStreak: {
        current: { type: Number, default: 0 },
        best: { type: Number, default: 0 },
        lastCheckDate: { type: Date, default: null },
        consecutiveLowDays: { type: Number, default: 0 },
        lastCompletionDate: { type: Date, default: null }
    },
    profilePicture: { type: String, default: "" },



    disabled: {
        type: Boolean,
        default: false
    },
    // Lifecycle Management Fields
    accountStatus: {
        type: String,
        enum: ['active', 'deactivated', 'pending_deletion'],
        default: 'active'
    },
    statusChangedAt: {
        type: Date,
        default: null
    },
    deletionGracePeriodExpiresAt: {
        type: Date,
        default: null
    },
    reportCount: {
        type: Number,
        default: 0
    },
    isReported: {
        type: Boolean,
        default: false
    },
    // Reason for disabling (admin action)
    disabledReason: {
        type: String,
        default: ""
    },

    socketId: {
        type: String,
        default: null
    },

    notificationPreferences: {
        habits: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true }
        },
        moods: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false }
        },
        streaks: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false }
        },
        journals: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false }
        },
        community: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false }
        },
        system: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true }
        }
    }
});


export const User = model("User", userSchema);