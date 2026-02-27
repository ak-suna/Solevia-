import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    emoji: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// One reaction per user per post (toggle = replace or remove)
reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const Reaction = model("Reaction", reactionSchema);
