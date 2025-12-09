import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'excited', 'neutral', 'tired', 'anxious', 'angry'],
    default: 'neutral'
  },
  tags: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
journalSchema.index({ user: 1, createdAt: -1 });
journalSchema.index({ user: 1, tags: 1 });

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;  // ← THIS IS THE CRITICAL LINE!