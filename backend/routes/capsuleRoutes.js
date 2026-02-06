import express from "express";
import Capsule from "../models/Capsule.js";
import { User } from "../models/User.js";
import { authenticate } from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get all capsules for logged-in user
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const capsules = await Capsule.find({ user: userId })
            .sort({ unlockDate: 1 });

        // Return capsules with encrypted content
        // Don't send PIN hashes to client
        const safeCapsules = capsules.map(capsule => ({
            _id: capsule._id,
            title: capsule.title,
            content: capsule.content, // Encrypted
            unlockDate: capsule.unlockDate,
            tags: capsule.tags,
            isLocked: capsule.isLocked,
            hasBeenOpened: capsule.hasBeenOpened,
            createdAt: capsule.createdAt
        }));

        res.json(safeCapsules);
    } catch (error) {
        console.error('Error fetching capsules:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single capsule
router.get('/:id', authenticate, async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        const capsule = await Capsule.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        // Check if capsule is unlocked by date
        const isDateUnlocked = new Date(capsule.unlockDate) <= new Date();

        if (!isDateUnlocked) {
            return res.status(403).json({
                message: 'Capsule is not yet unlocked',
                unlockDate: capsule.unlockDate
            });
        }

        res.json({
            _id: capsule._id,
            title: capsule.title,
            content: capsule.content,
            unlockDate: capsule.unlockDate,
            tags: capsule.tags,
            isLocked: capsule.isLocked,
            hasBeenOpened: capsule.hasBeenOpened
        });
    } catch (error) {
        console.error('Error fetching capsule:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new capsule
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, content, unlockDate, tags, isLocked, pin } = req.body;

        if (!title || !content || !unlockDate) {
            return res.status(400).json({
                message: 'Title, content, and unlock date are required'
            });
        }

        // Validate unlock date is in the future
        const selectedDate = new Date(unlockDate);
        const today = new Date();

        if (selectedDate <= today) {
            return res.status(400).json({
                message: 'Unlock date must be in the future'
            });
        }

        const userId = req.user?._id || req.user?.id;

        const capsule = new Capsule({
            user: userId,
            title,
            content, // Already encrypted on client-side
            unlockDate: selectedDate,
            tags: tags || [],
            isLocked: isLocked || false,
            pin: isLocked ? pin : undefined // Will be hashed by pre-save hook
        });

        await capsule.save();

        res.status(201).json({
            _id: capsule._id,
            title: capsule.title,
            unlockDate: capsule.unlockDate,
            tags: capsule.tags,
            isLocked: capsule.isLocked,
            createdAt: capsule.createdAt
        });
    } catch (error) {
        console.error('Error creating capsule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Unlock capsule with PIN
router.post('/:id/unlock', authenticate, async (req, res) => {
    try {
        const { pin } = req.body;
        const userId = req.user?._id || req.user?.id;

        const capsule = await Capsule.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        // Check if date-locked
        const isDateUnlocked = new Date(capsule.unlockDate) <= new Date();
        if (!isDateUnlocked) {
            return res.status(403).json({
                message: 'Capsule date has not arrived yet'
            });
        }

        // Verify PIN if locked
        if (capsule.isLocked) {
            const isPinValid = await capsule.verifyPin(pin);

            if (!isPinValid) {
                return res.status(401).json({ message: 'Incorrect PIN' });
            }
        }

        // Mark as opened
        capsule.hasBeenOpened = true;
        await capsule.save();

        res.json({
            success: true,
            content: capsule.content // Still encrypted, client will decrypt
        });
    } catch (error) {
        console.error('Error unlocking capsule:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Unlock with account password (forgot PIN)
router.post('/:id/unlock-with-password', authenticate, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user?._id || req.user?.id;

        // Verify user's password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Get capsule
        const capsule = await Capsule.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        // Check if date-locked
        const isDateUnlocked = new Date(capsule.unlockDate) <= new Date();
        if (!isDateUnlocked) {
            return res.status(403).json({
                message: 'Capsule date has not arrived yet'
            });
        }

        // Mark as opened
        capsule.hasBeenOpened = true;
        await capsule.save();

        res.json({
            success: true,
            content: capsule.content
        });
    } catch (error) {
        console.error('Error unlocking capsule:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete capsule
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        const capsule = await Capsule.findOneAndDelete({
            _id: req.params.id,
            user: userId
        });

        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        res.json({ message: 'Capsule deleted successfully' });
    } catch (error) {
        console.error('Error deleting capsule:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;