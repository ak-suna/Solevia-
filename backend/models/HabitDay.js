import mongoose from "mongoose";

const habitDaySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  habits: [{
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true
    }
  }],
  completionPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  completedCount: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one entry per user per day
habitDaySchema.index({ user: 1, date: 1 }, { unique: true });

// Index for faster queries
habitDaySchema.index({ user: 1, date: -1 });

const HabitDay = mongoose.model('HabitDay', habitDaySchema);

export default HabitDay;

