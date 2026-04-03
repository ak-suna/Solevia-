import { Schema, model } from "mongoose";

const daySchema = new Schema({
    date: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { _id: false });

const challengeParticipantSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    challengeId: {
        type: Schema.Types.ObjectId,
        ref: "Challenge",
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    days: [daySchema],
    completionPercentage: {
        type: Number,
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    badgeAwarded: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

challengeParticipantSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
challengeParticipantSchema.index({ challengeId: 1 });

export const ChallengeParticipant = model("ChallengeParticipant", challengeParticipantSchema);