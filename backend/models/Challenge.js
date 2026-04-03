// import { Schema, model } from "mongoose";

// const participantSchema = new Schema({
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     joinedAt: { type: Date, default: Date.now },
//     progress: { type: Number, default: 0 }, // percentage or count
//     completedDays: [{ type: Date }],
//     isCompleted: { type: Boolean, default: false },
//     completedAt: { type: Date }
// });

// const challengeSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//         trim: true,
//         maxlength: 100
//     },
//     description: {
//         type: String,
//         required: true,
//         maxlength: 1000
//     },
//     type: {
//         type: String,
//         enum: ["daily", "weekly", "custom"],
//         required: true
//     },
//     category: {
//         type: String,
//         enum: ["habits", "gratitude", "mindfulness", "fitness", "journaling", "wellness", "digital-detox", "other"],
//         required: true
//     },
//     icon: {
//         type: String,
//         default: "🎯" // emoji icon
//     },
//     duration: {
//         type: Number, // in days
//         required: true
//     },
//     startDate: {
//         type: Date,
//         required: true
//     },
//     endDate: {
//         type: Date,
//         required: true
//     },
//     rules: [{
//         type: String,
//         trim: true
//     }],
//     dailyGoal: {
//         description: { type: String },
//         target: { type: Number } // e.g., 3 for "3 gratitude entries"
//     },
//     participants: [participantSchema],
//     maxParticipants: {
//         type: Number,
//         default: null // null = unlimited
//     },
//     rewards: {
//         badge: { type: String }, // badge emoji or name
//         points: { type: Number, default: 0 }
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     },
//     isFeatured: {
//         type: Boolean,
//         default: false
//     },
//     createdBy: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     timestamps: true
// });

// // Index for faster queries
// challengeSchema.index({ isActive: 1, startDate: -1 });
// challengeSchema.index({ category: 1, isActive: 1 });
// challengeSchema.index({ endDate: 1 });

// // Virtual for participant count
// challengeSchema.virtual('participantCount').get(function() {
//     return this.participants.length;
// });

// // Virtual for completion rate
// challengeSchema.virtual('completionRate').get(function() {
//     if (this.participants.length === 0) return 0;
//     const completed = this.participants.filter(p => p.isCompleted).length;
//     return Math.round((completed / this.participants.length) * 100);
// });

// // Virtual to check if challenge is full
// challengeSchema.virtual('isFull').get(function() {
//     if (!this.maxParticipants) return false;
//     return this.participants.length >= this.maxParticipants;
// });

// // Virtual to check if challenge has started
// challengeSchema.virtual('hasStarted').get(function() {
//     return new Date() >= this.startDate;
// });

// // Virtual to check if challenge has ended
// challengeSchema.virtual('hasEnded').get(function() {
//     return new Date() > this.endDate;
// });

// challengeSchema.set('toJSON', { virtuals: true });
// challengeSchema.set('toObject', { virtuals: true });

// export const Challenge = model("Challenge", challengeSchema);
import { Schema, model } from "mongoose";

const challengeSchema = new Schema({
    templateId: {
        type: Schema.Types.ObjectId,
        ref: "ChallengeTemplate",
        default: null
    },
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
        enum: ["active", "expired"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    participantCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });

challengeSchema.index({ status: 1, endDate: 1 });
challengeSchema.index({ templateId: 1 });

export const Challenge = model("Challenge", challengeSchema);