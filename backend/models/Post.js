import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    emoji: { type: String, required: true }, // 👍, ❤️, 🎉, 💪, 🙏
    createdAt: { type: Date, default: Date.now }
});

const commentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    isEdited: { type: Boolean, default: false }
});

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
        type: String, // URL to image if user uploads one
        default: null 
    },
    reactions: [reactionSchema],
    comments: [commentSchema],
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

// Virtual for reaction counts
postSchema.virtual('reactionCounts').get(function() {
    const counts = {};
    this.reactions.forEach(reaction => {
        counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
    return counts;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

export const Post = model("Post", postSchema);