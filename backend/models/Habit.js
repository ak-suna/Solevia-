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
  habitDate: {
    type: Date,
    default: function() {
      // Default to today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    },
    index: true
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: null
  },
  daysOfWeek: {
    type: [Number], // [0,1,2,3,4,5,6] where 0=Sunday, 1=Monday, etc.
    default: []
  },
  linkedGoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    default: null
  },
  goalContribution: {
    type: Number,
    default: 10, // percentage
    min: 0,
    max: 100
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
    enum: ['Fitness', 'Health', 'Learning', 'Career', 'Finance', 'Personal', 'Other'],
    default: 'Other'
  },
  linkedGoals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  }]
}, {
  timestamps: true
});


// Index for faster queries
habitSchema.index({ user: 1, createdAt: -1 });
habitSchema.index({ user: 1, habitDate: -1, isArchived: 1 });
habitSchema.index({ user: 1, isRecurring: 1 });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;