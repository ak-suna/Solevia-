import express from "express";
import Journal from "../models/Journal.js";
import { User } from "../models/User.js";
import { authenticate } from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get all journal entries for logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const entries = await Journal.find({ user: userId })
      .sort({ createdAt: -1 });

    // Return entries with encrypted content but without PIN hashes
    const safeEntries = entries.map(entry => ({
      _id: entry._id,
      title: entry.title,
      content: entry.content, // Encrypted
      mood: entry.mood,
      tags: entry.tags,
      date: entry.date,
      isLocked: entry.isLocked,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    }));

    res.json(safeEntries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single journal entry
router.get('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const entry = await Journal.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({
      _id: entry._id,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags,
      date: entry.date,
      isLocked: entry.isLocked,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new journal entry
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, mood, tags, isLocked, pin } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const userId = req.user?._id || req.user?.id;

    const entry = new Journal({
      user: userId,
      title: title || 'Untitled',
      content, // Already encrypted on client-side
      mood: mood || 'neutral',
      tags: tags || [],
      isLocked: isLocked || false,
      pin: isLocked ? pin : undefined // Will be hashed by pre-save hook
    });

    await entry.save();

    res.status(201).json({
      _id: entry._id,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags,
      date: entry.date,
      isLocked: entry.isLocked,
      createdAt: entry.createdAt
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update journal entry
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, content, mood, tags, isLocked, pin } = req.body;
    const userId = req.user?._id || req.user?.id;

    const entry = await Journal.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    entry.title = title || entry.title;
    entry.content = content || entry.content;
    entry.mood = mood || entry.mood;
    entry.tags = tags || entry.tags;

    // Handle PIN lock updates
    if (isLocked !== undefined) {
      entry.isLocked = isLocked;
      if (isLocked && pin) {
        entry.pin = pin; // Will be hashed by pre-save hook
      } else if (!isLocked) {
        entry.pin = undefined;
      }
    }

    await entry.save();

    res.json({
      _id: entry._id,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags,
      date: entry.date,
      isLocked: entry.isLocked,
      updatedAt: entry.updatedAt
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlock journal entry with PIN
router.post('/:id/unlock', authenticate, async (req, res) => {
  try {
    const { pin } = req.body;
    const userId = req.user?._id || req.user?.id;

    const entry = await Journal.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Verify PIN
    if (entry.isLocked) {
      const isPinValid = await entry.verifyPin(pin);

      if (!isPinValid) {
        return res.status(401).json({ message: 'Incorrect PIN' });
      }
    }

    res.json({
      success: true,
      content: entry.content // Still encrypted, client will decrypt
    });
  } catch (error) {
    console.error('Error unlocking journal entry:', error);
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

    // Get entry
    const entry = await Journal.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({
      success: true,
      content: entry.content
    });
  } catch (error) {
    console.error('Error unlocking journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete journal entry
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const entry = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: userId
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;