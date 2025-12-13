// import express from 'express';
// import Habit from '../models/Habit.js';
// import { authenticateToken } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Get all habits for logged-in user
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
//     res.json(habits);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Create new habit
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { name, category } = req.body;
    
//     const habit = new Habit({
//       user: req.user.id,
//       name,
//       category: category || 'general',
//       completedToday: false,
//       streak: 0
//     });
    
//     await habit.save();
//     res.status(201).json(habit);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Toggle habit completion
// router.patch('/:id/toggle', authenticateToken, async (req, res) => {
//   try {
//     const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
//     if (!habit) {
//       return res.status(404).json({ message: 'Habit not found' });
//     }
    
//     habit.completedToday = !habit.completedToday;
    
//     // Update streak logic
//     if (habit.completedToday) {
//       const today = new Date().setHours(0, 0, 0, 0);
//       const lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate).setHours(0, 0, 0, 0) : null;
      
//       if (!lastCompleted || today - lastCompleted === 86400000) { // 1 day difference
//         habit.streak += 1;
//         if (habit.streak > habit.bestStreak) {
//           habit.bestStreak = habit.streak;
//         }
//       } else if (today - lastCompleted > 86400000) {
//         habit.streak = 1; // Reset streak
//       }
      
//       habit.lastCompletedDate = new Date();
//     } else {
//       // If unchecking today's habit
//       habit.streak = Math.max(0, habit.streak - 1);
//     }
    
//     await habit.save();
//     res.json(habit);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Delete habit
// router.delete('/:id', authenticateToken, async (req, res) => {
//   try {
//     const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
//     if (!habit) {
//       return res.status(404).json({ message: 'Habit not found' });
//     }
    
//     res.json({ message: 'Habit deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;
import express from 'express';
import Habit from '../models/Habit.js';
import { authenticate } from '../middleware/authMiddleware.js'; // Changed here

const router = express.Router();

// Get all habits for logged-in user
router.get('/', authenticate, async (req, res) => { // Changed here
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new habit
router.post('/', authenticate, async (req, res) => { // Changed here
  try {
    const { name, category } = req.body;
    
    const habit = new Habit({
      user: req.user.id,
      name,
      category: category || 'general',
      completedToday: false,
      streak: 0
    });
    
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle habit completion
router.patch('/:id/toggle', authenticate, async (req, res) => { // Changed here
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    habit.completedToday = !habit.completedToday;
    
    // Update streak logic
    if (habit.completedToday) {
      const today = new Date().setHours(0, 0, 0, 0);
      const lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate).setHours(0, 0, 0, 0) : null;
      
      if (!lastCompleted || today - lastCompleted === 86400000) { // 1 day difference
        habit.streak += 1;
        if (habit.streak > habit.bestStreak) {
          habit.bestStreak = habit.streak;
        }
      } else if (today - lastCompleted > 86400000) {
        habit.streak = 1; // Reset streak
      }
      
      habit.lastCompletedDate = new Date();
    } else {
      // If unchecking today's habit
      habit.streak = Math.max(0, habit.streak - 1);
    }
    
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete habit
router.delete('/:id', authenticate, async (req, res) => { // Changed here
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;