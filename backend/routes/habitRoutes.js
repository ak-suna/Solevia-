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
import mongoose from 'mongoose';
import Habit from '../models/Habit.js';
import HabitDay from '../models/HabitDay.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/authMiddleware.js';

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
// Create new habit
router.post('/', authenticate, async (req, res) => {
  try {
    console.log('📝 Creating habit:', req.body); // ADD for debugging
    const { name, category } = req.body;
    
    const habit = new Habit({
      user: req.user.id,
      name,
      category: category || 'Other', // Changed 'general' to 'Other'
      completedToday: false
    });
    
    await habit.save();
    console.log('✅ Habit created:', habit); // ADD for debugging
    res.status(201).json(habit);
  } catch (error) {
    console.error('❌ Error creating habit:', error); // ADD for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle habit completion
router.patch('/:id/toggle', authenticate, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    const wasCompleted = habit.completedToday;
    habit.completedToday = !habit.completedToday;
    
    // FIX: Proper if-else instead of ternary
    if (habit.completedToday) {
      habit.lastCompletedDate = new Date();
    }
    
    await habit.save();
    
    // Update linked goals if habit was just completed
    const updatedGoals = [];
    if (habit.completedToday && !wasCompleted && habit.linkedGoals && habit.linkedGoals.length > 0) {
      const Goal = (await import('../models/Goal.js')).default;
      const goals = await Goal.find({ 
        _id: { $in: habit.linkedGoals },
        user: req.user.id 
      });
      
      for (const goal of goals) {
        // Find the contribution value for this habit
        const habitLink = goal.linkedHabits.find(
          link => link.habitId.toString() === habit._id.toString()
        );
        
        if (habitLink) {
          const contributionValue = habitLink.contributionValue || 1;
          goal.current = Math.max(0, goal.current + contributionValue);
          
          // Auto-calculate progress
          goal.progress = goal.target > 0 
            ? Math.min(100, Math.max(0, Math.round((goal.current / goal.target) * 100)))
            : 0;
          
          // Update status if completed
          if (goal.progress >= 100) {
            goal.status = 'completed';
            goal.current = Math.min(goal.current, goal.target);
            goal.progress = 100;
          } else if (goal.status === 'completed' && goal.progress < 100) {
            goal.status = 'active';
          }
          
          await goal.save();
          updatedGoals.push(goal);
        }
      }
    }
    
    res.json({ habit, updatedGoals });
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

// Check new day and update streak logic
router.post('/check-day', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const habits = await Habit.find({ user: req.user.id });
    
    if (habits.length === 0) {
      return res.json(user.habitStreak || { current: 0, best: 0 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const lastCheck = user.habitStreak?.lastCheckDate 
      ? new Date(user.habitStreak.lastCheckDate).setHours(0, 0, 0, 0)
      : null;
    
    // Initialize habitStreak if it doesn't exist
    if (!user.habitStreak) {
      user.habitStreak = {
        current: 0,
        best: 0,
        lastCheckDate: null,
        consecutiveLowDays: 0,
        lastCompletionDate: null
      };
    }
    
    // If it's a new day and we haven't checked yet
    if (!lastCheck || todayTimestamp > lastCheck) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const yesterdayTimestamp = yesterday.getTime();
      
      // Only process if we had a previous check (not first time)
      if (lastCheck) {
        const totalYesterday = habits.length;
        
        // Check if yesterday's snapshot already exists
        let yesterdaySnapshot = await HabitDay.findOne({
          user: req.user.id,
          date: yesterday
        });
        
        // If snapshot doesn't exist, create it
        // We use lastCompletedDate to determine if a habit was completed yesterday
        // A habit was completed yesterday if its lastCompletedDate is exactly yesterday
        if (!yesterdaySnapshot && totalYesterday > 0) {
          const yesterdayHabits = habits.map(h => {
            let wasCompleted = false;
            if (h.lastCompletedDate) {
              const completedDate = new Date(h.lastCompletedDate);
              completedDate.setHours(0, 0, 0, 0);
              wasCompleted = completedDate.getTime() === yesterdayTimestamp;
            }
            return {
              habitId: h._id,
              name: h.name,
              completed: wasCompleted
            };
          });
          
          const completedCount = yesterdayHabits.filter(h => h.completed).length;
          const completionPercentage = totalYesterday > 0 
            ? Math.round((completedCount / totalYesterday) * 100) 
            : 0;
          
          // Only create snapshot if we have habits
          if (totalYesterday > 0) {
            yesterdaySnapshot = await HabitDay.create({
              user: req.user.id,
              date: yesterday,
              habits: yesterdayHabits,
              completionPercentage,
              completedCount,
              totalCount: totalYesterday
            });
          }
        }
        
        // Use snapshot for streak calculations
        const completionPercentage = yesterdaySnapshot ? yesterdaySnapshot.completionPercentage : 0;
        
        // NEW STREAK LOGIC:
        // 1. If completion >= 80%: Increment streak by 1, reset consecutiveLowDays
        // 2. If completion < 80%: Streak stays the same (pauses), increment consecutiveLowDays
        // 3. If TWO consecutive days with < 80%: Reset streak to 0, reset consecutiveLowDays
        
        if (yesterdaySnapshot && yesterdaySnapshot.totalCount > 0) {
          if (completionPercentage >= 80) {
            // Increment streak
            user.habitStreak.current = (user.habitStreak.current || 0) + 1;
            if (user.habitStreak.current > (user.habitStreak.best || 0)) {
              user.habitStreak.best = user.habitStreak.current;
            }
            // Reset consecutive low days
            user.habitStreak.consecutiveLowDays = 0;
            user.habitStreak.lastCompletionDate = yesterday;
          } else {
            // Completion < 80%: Pause streak, increment consecutive low days
            user.habitStreak.consecutiveLowDays = (user.habitStreak.consecutiveLowDays || 0) + 1;
            
            // If two consecutive days with < 80%, reset streak
            if (user.habitStreak.consecutiveLowDays >= 2) {
              user.habitStreak.current = 0;
              user.habitStreak.consecutiveLowDays = 0;
            }
          }
        }
      }
      
      // Update lastCheckDate
      user.habitStreak.lastCheckDate = today;
      
      // Reset all habits' completedToday for new day
      await Habit.updateMany(
        { user: req.user.id },
        { completedToday: false }
      );
      
      await user.save();
    }
    
    res.json(user.habitStreak || { current: 0, best: 0, consecutiveLowDays: 0 });
  } catch (error) {
    console.error('Error checking new day:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get historical habit data
router.get('/history', authenticate, async (req, res) => {
  try {
    const { limit = 30 } = req.query; // Default to last 30 days
    
    const habitDays = await HabitDay.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .populate('habits.habitId', 'name');
    
    res.json(habitDays);
  } catch (error) {
    console.error('Error fetching habit history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get linked goals for a habit
router.get('/:id/linked-goals', authenticate, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id)
      .populate('linkedGoals', 'name target current progress unit')
      .select('linkedGoals');
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(habit.linkedGoals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;