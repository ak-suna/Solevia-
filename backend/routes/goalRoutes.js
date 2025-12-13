// import express from 'express';
// import Goal from '../models/Goal.js';
// import { authenticateToken } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Get all goals for logged-in user
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
//     res.json(goals);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Create new goal
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { name, target, unit, deadline } = req.body;
    
//     const goal = new Goal({
//       user: req.user.id,
//       name,
//       target,
//       unit,
//       deadline: deadline || null,
//       progress: 0,
//       current: 0,
//       status: 'active'
//     });
    
//     await goal.save();
//     res.status(201).json(goal);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Update goal progress
// router.patch('/:id/progress', authenticateToken, async (req, res) => {
//   try {
//     const { increment } = req.body;
//     const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    
//     if (!goal) {
//       return res.status(404).json({ message: 'Goal not found' });
//     }
    
//     goal.progress = Math.min(100, Math.max(0, goal.progress + increment));
    
//     // Update status if completed
//     if (goal.progress === 100) {
//       goal.status = 'completed';
//     } else if (goal.status === 'completed' && goal.progress < 100) {
//       goal.status = 'active';
//     }
    
//     await goal.save();
//     res.json(goal);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Delete goal
// router.delete('/:id', authenticateToken, async (req, res) => {
//   try {
//     const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
//     if (!goal) {
//       return res.status(404).json({ message: 'Goal not found' });
//     }
    
//     res.json({ message: 'Goal deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;
import express from 'express';
import Goal from '../models/Goal.js';
import { authenticate } from '../middleware/authMiddleware.js'; // Changed here

const router = express.Router();

// Get all goals for logged-in user
router.get('/', authenticate, async (req, res) => { // Changed here
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new goal
router.post('/', authenticate, async (req, res) => { // Changed here
  try {
    const { name, target, unit, deadline } = req.body;
    
    const goal = new Goal({
      user: req.user.id,
      name,
      target,
      unit,
      deadline: deadline || null,
      progress: 0,
      current: 0,
      status: 'active'
    });
    
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update goal progress
router.patch('/:id/progress', authenticate, async (req, res) => { // Changed here
  try {
    const { increment } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    goal.progress = Math.min(100, Math.max(0, goal.progress + increment));
    
    // Update status if completed
    if (goal.progress === 100) {
      goal.status = 'completed';
    } else if (goal.status === 'completed' && goal.progress < 100) {
      goal.status = 'active';
    }
    
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete goal
router.delete('/:id', authenticate, async (req, res) => { // Changed here
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;