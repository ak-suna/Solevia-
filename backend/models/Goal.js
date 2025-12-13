import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
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
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  target: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  deadline: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, createdAt: -1 });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;