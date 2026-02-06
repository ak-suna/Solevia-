import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const capsuleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        // Content is encrypted on client-side before storage
    },
    unlockDate: {
        type: Date,
        required: true
    },
    tags: [{
        type: String
    }],
    isLocked: {
        type: Boolean,
        default: false
    },
    pin: {
        type: String,
        // Hashed PIN if isLocked is true
    },
    hasBeenOpened: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Hash PIN before saving
capsuleSchema.pre('save', async function (next) {
    if (this.isLocked && this.pin && this.isModified('pin')) {
        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
    }
    next();
});

// Method to verify PIN
capsuleSchema.methods.verifyPin = async function (enteredPin) {
    if (!this.isLocked || !this.pin) {
        return true;
    }
    return await bcrypt.compare(enteredPin, this.pin);
};

// Index for faster queries
capsuleSchema.index({ user: 1, unlockDate: 1 });
capsuleSchema.index({ user: 1, tags: 1 });

const Capsule = mongoose.model('Capsule', capsuleSchema);

export default Capsule;