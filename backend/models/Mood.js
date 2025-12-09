import { Schema, model } from "mongoose";

const moodSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
        index: true
    },
    mood: { 
        type: String, 
        required: true,
        enum: ["happy", "sad", "neutral", "excited", "angry", "anxious", "tired"]
    },
    emoji: { 
        type: String, 
        required: true 
    },
    label: { 
        type: String, 
        required: true 
    },
    color: { 
        type: String, 
        required: true 
    },
    period: { 
        type: String, 
        required: true,
        enum: ["morning", "evening"]
    },
    date: { 
        type: Date, 
        default: Date.now,
        index: true
    },
    journalEntry: { 
        type: String,
        default: null
    }
}, {
    timestamps: true
});

moodSchema.index({ userId: 1, date: -1 });
moodSchema.index({ userId: 1, period: 1, date: 1 });

export const Mood = model("Mood", moodSchema);