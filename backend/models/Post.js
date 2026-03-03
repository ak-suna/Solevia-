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
        enum: ["general", "tip", "reflection", "motivation", "story"],
        default: "general"
    },
    category: {
        type: String,
        enum: ["wellbeing", "habits", "journaling", "gratitude", "mindfulness", "fitness", "other"],
        default: "other"
    },
    image: {
        type: String, // Cloudinary URL
        default: null
    },
    imagePublicId: {
        type: String, // Cloudinary public ID for deletion
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
        default: null // null means it's a public post
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ groupId: 1, createdAt: -1 });
postSchema.index({ isHidden: 1, createdAt: -1 });

export const Post = model("Post", postSchema);