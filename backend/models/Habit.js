import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  completedToday: {
    type: Boolean,
    default: false
  },
  streak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  lastCompletedDate: {
    type: Date,
    default: null
  },
  completionHistory: [{
    date: { type: Date },
    completed: { type: Boolean }
  }],
  category: {
    type: String,
    default: 'general'
  }
}, {
  timestamps: true
});

// Index for faster queries
habitSchema.index({ user: 1, createdAt: -1 });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;