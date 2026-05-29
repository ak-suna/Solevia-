import mongoose from "mongoose";

const groupSessionSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "SupportGroup", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 500, default: "" },
    scheduledAt: { type: Date, required: true },
    calendlyLink: { type: String, default: "" },
    autoPostId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    rsvps: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rsvpedAt: { type: Date, default: Date.now }
    }],
    status: {
        type: String,
        enum: ["upcoming", "active", "completed", "inactive"],
        default: "upcoming"
    }
}, { timestamps: true });

groupSessionSchema.index({ groupId: 1, scheduledAt: 1 });

export const GroupSession = mongoose.model("GroupSession", groupSessionSchema);