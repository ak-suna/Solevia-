import { Schema, model } from "mongoose";

const challengeTemplateSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    trackingType: {
        type: String,
        enum: ["mood", "habit", "journal", "manual"],
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    lastUsedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

challengeTemplateSchema.index({ status: 1, lastUsedAt: 1 });

export const ChallengeTemplate = model("ChallengeTemplate", challengeTemplateSchema);