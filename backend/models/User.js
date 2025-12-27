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
    role: { type: String, enum: ["user", "admin"], default: "user"},
    moodStreak: {current: { type: Number, default: 0 }, best: { type: Number, default: 0 }, lastEntryDate: { type: Date, default: null }
  },
    habitStreak: {current: { type: Number, default: 0 }, best: { type: Number, default: 0 }, lastCheckDate: { type: Date, default: null }
},

// ADD THESE FIELDS (keep all existing fields)
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
