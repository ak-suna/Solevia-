import express from "express";
import Journal from "../models/Journal.js";
import { authenticate } from "../middleware/authMiddleware.js";

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
    res.json(entries);
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
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new journal entry
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const userId = req.user?._id || req.user?.id;
    
    const entry = new Journal({
      user: userId,
      title: title || 'Untitled',
      content,
      mood: mood || 'neutral',
      tags: tags || []
    });
    
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update journal entry
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
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
    
    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
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