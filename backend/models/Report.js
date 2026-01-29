import { Schema, model } from "mongoose";

const reportSchema = new Schema({
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportType: {
        type: String,
        enum: ["post", "user", "comment"],
        required: true
    },
    targetId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'reportType' // dynamically references Post or User model
    },
    reason: {
        type: String,
        enum: [
            "spam",
            "harassment",
            "inappropriate-content",
            "misinformation",
            "hate-speech",
            "self-harm",
            "violence",
            "other"
        ],
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "under-review", "resolved", "dismissed"],
        default: "pending"
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviewedAt: {
        type: Date
    },
    action: {
        type: String,
        enum: ["none", "warning", "content-removed", "user-suspended", "user-banned"],
        default: "none"
    },
    adminNotes: {
        type: String,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ targetId: 1, reportType: 1 });

export const Report = model("Report", reportSchema);