import { Schema, model } from "mongoose";

const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    type: {
        type: String,
        enum: ["general", "tip", "reflection", "motivation", "story", "community", "group", "challenge"],
        default: "general"
    },
    category: {
        type: String,
        enum: ["wellbeing", "habits", "journaling", "gratitude", "mindfulness", "fitness", "other"],
        default: "other"
    },
    image: {
        type: String,
        default: null
    },
    imagePublicId: {
        type: String,
        default: null
    },
    isReported: {
        type: Boolean,
        default: false
    },
    reportCount: {
        type: Number,
        default: 0
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: "SupportGroup",
        default: null
    },
    challengeId: {
        type: Schema.Types.ObjectId,
        ref: "Challenge",
        default: null
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    reactions: [{
        emoji: { type: String },
        count: { type: Number, default: 0 },
        userIds: [{ type: Schema.Types.ObjectId, ref: "User" }]
    }]
}, {
    timestamps: true
});

postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ groupId: 1, createdAt: -1 });
postSchema.index({ challengeId: 1, createdAt: -1 });
postSchema.index({ isHidden: 1, createdAt: -1 });

export const Post = model("Post", postSchema);