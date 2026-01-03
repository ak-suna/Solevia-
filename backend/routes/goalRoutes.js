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
router.get('/', authenticate, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id })
      .populate('linkedHabits.habitId', 'name category')
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new goal
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, target, unit, deadline, category } = req.body;
    
    const goal = new Goal({
      user: req.user.id,
      name,
      target,
      unit,
      deadline: deadline || null,
      category: category || 'Other',
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
router.patch('/:id/progress', authenticate, async (req, res) => {
  try {
    const { currentIncrement } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Update current value
    goal.current = Math.max(0, goal.current + (currentIncrement || 0));
    
    // Auto-calculate progress from current and target
    goal.progress = goal.target > 0 
      ? Math.min(100, Math.max(0, Math.round((goal.current / goal.target) * 100)))
      : 0;
    
    // Update status if completed
    if (goal.progress >= 100) {
      goal.status = 'completed';
      goal.current = Math.min(goal.current, goal.target); // Cap current at target
      goal.progress = 100; // Ensure progress is exactly 100 when completed
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
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Remove goal from linked habits
    const Habit = (await import('../models/Habit.js')).default;
    await Habit.updateMany(
      { linkedGoals: req.params.id },
      { $pull: { linkedGoals: req.params.id } }
    );
    
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Link habits to goal
router.patch('/:id/link-habits', authenticate, async (req, res) => {
  try {
    const { habitIds, contributionValues } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const Habit = (await import('../models/Habit.js')).default;
    
    // Remove old links from habits
    const oldHabitIds = goal.linkedHabits.map(link => link.habitId.toString());
    await Habit.updateMany(
      { _id: { $in: oldHabitIds } },
      { $pull: { linkedGoals: req.params.id } }
    );
    
    // Create new linked habits array
    const linkedHabits = habitIds.map((habitId, index) => ({
      habitId,
      contributionValue: contributionValues && contributionValues[index] !== undefined 
        ? contributionValues[index] 
        : 1
    }));
    
    goal.linkedHabits = linkedHabits;
    await goal.save();
    
    // Add goal to habits' linkedGoals
    if (habitIds && habitIds.length > 0) {
      await Habit.updateMany(
        { _id: { $in: habitIds }, user: req.user.id },
        { $addToSet: { linkedGoals: req.params.id } }
      );
    }
    
    const populatedGoal = await Goal.findById(goal._id).populate('linkedHabits.habitId', 'name category');
    res.json(populatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get linked habits for a goal
router.get('/:id/linked-habits', authenticate, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id)
      .populate('linkedHabits.habitId', 'name category')
      .select('linkedHabits');
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(goal.linkedHabits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;