import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    required: true,
    // Content is encrypted on client-side before storage
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
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  pin: {
    type: String,
    // Hashed PIN if isLocked is true
  }
}, {
  timestamps: true
});

// Hash PIN before saving
journalSchema.pre('save', async function (next) {
  if (this.isLocked && this.pin && this.isModified('pin')) {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
  }
  next();
});

// Method to verify PIN
journalSchema.methods.verifyPin = async function (enteredPin) {
  if (!this.isLocked || !this.pin) {
    return true;
  }
  return await bcrypt.compare(enteredPin, this.pin);
};

// Index for faster queries
journalSchema.index({ user: 1, createdAt: -1 });
journalSchema.index({ user: 1, tags: 1 });

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;