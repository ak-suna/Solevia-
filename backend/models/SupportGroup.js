import { Schema, model } from "mongoose";

const supportGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    category: {
        type: String,
        required: true,
        enum: ["journaling", "gratitude", "mindfulness", "fitness", "habits", "goals", "wellness", "other"]
    },
    icon: {
        type: String,
        default: "📝" // emoji icon for the group
    },
    members: [{
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        joinedAt: { type: Date, default: Date.now },
        role: {
            type: String,
            enum: ["member", "moderator"],
            default: "member"
        }
    }],
    maxMembers: {
        type: Number,
        default: 50 // small groups
    },
    weeklyTask: {
        task: { type: String, default: "" },
        week: { type: Date },
        completedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
supportGroupSchema.index({ category: 1 });
supportGroupSchema.index({ isActive: 1 });

// Virtual for member count
supportGroupSchema.virtual('memberCount').get(function () {
    return this.members.length;
});

// Virtual to check if group is full
supportGroupSchema.virtual('isFull').get(function () {
    return this.members.length >= this.maxMembers;
});

supportGroupSchema.set('toJSON', { virtuals: true });
supportGroupSchema.set('toObject', { virtuals: true });

export const SupportGroup = model("SupportGroup", supportGroupSchema);