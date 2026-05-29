import express from 'express';
import mongoose from 'mongoose';
import Habit from '../models/Habit.js';
import HabitDay from '../models/HabitDay.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { updateChallengeProgress } from '../utils/challengeUtils.js';

const router = express.Router();

// Helper: save/update today's HabitDay snapshot in real time
const saveTodaySnapshot = async (userId) => {
  const todaySnap = new Date();
  todaySnap.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todaySnap);
  todayEnd.setHours(23, 59, 59, 999);
  const todayDayOfWeek = todaySnap.getDay();

  // Get all non-archived habits for this user
  const allHabits = await Habit.find({ user: userId, isArchived: { $ne: true } });

  // Filter only habits that apply today (same logic as /today route)
  const relevantHabits = allHabits.filter(h => {
    if (h.isRecurring) {
      if (h.frequency === 'daily') return true;
      if ((h.frequency === 'weekly' || h.frequency === 'custom') && h.daysOfWeek.includes(todayDayOfWeek)) return true;
      return false;
    }
    // One-time habit: check if habitDate matches today
    const hDate = h.habitDate ? new Date(h.habitDate).setHours(0, 0, 0, 0) : null;
    return hDate === todaySnap.getTime();
  });

  const habitSnapshots = relevantHabits.map(h => ({
    habitId: h._id,
    name: h.name,
    completed: h.completedToday
  }));

  const completedCount = habitSnapshots.filter(h => h.completed).length;
  const totalCount = habitSnapshots.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Upsert: update if exists, create if not
  await HabitDay.findOneAndUpdate(
    { user: userId, date: todaySnap },
    { habits: habitSnapshots, completedCount, totalCount, completionPercentage },
    { upsert: true, new: true }
  );
};

// Get all habits for logged-in user (for backward compatibility)
router.get('/', authenticate, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get today's habits (one-time + recurring that match today)
router.get('/today', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todayDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Get one-time habits for today that are not archived
    const oneTimeHabits = await Habit.find({
      user: req.user.id,
      habitDate: { $gte: today, $lte: todayEnd },
      isArchived: { $ne: true },
      isRecurring: { $ne: true }
    }).populate('linkedGoalId', 'name').sort({ createdAt: -1 });

    // Get recurring habits that match today
    const recurringHabits = await Habit.find({
      user: req.user.id,
      isRecurring: true,
      isArchived: { $ne: true },
      $or: [
        { frequency: 'daily' },
        {
          frequency: 'weekly',
          daysOfWeek: todayDayOfWeek
        },
        {
          frequency: 'custom',
          daysOfWeek: todayDayOfWeek
        }
      ]
    }).populate('linkedGoalId', 'name').sort({ createdAt: -1 });

    // Combine and return
    const allHabits = [...oneTimeHabits, ...recurringHabits];
    res.json(allHabits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get past/archived habits
router.get('/past', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastHabits = await Habit.find({
      user: req.user.id,
      $or: [
        { isArchived: true },
        {
          habitDate: { $lt: today },
          isRecurring: { $ne: true }
        }
      ]
    }).populate('linkedGoalId', 'name').sort({ habitDate: -1, createdAt: -1 });

    res.json(pastHabits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new habit
router.post('/', authenticate, async (req, res) => {
  try {
    console.log('📝 Creating habit:', req.body);
    const {
      name,
      category,
      habitDate,
      isRecurring,
      frequency,
      daysOfWeek,
      linkedGoalId,
      goalContribution
    } = req.body;

    // Set habitDate: if recurring, use today; otherwise use provided date or today
    let finalHabitDate;
    if (isRecurring) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      finalHabitDate = today;
    } else {
      if (habitDate) {
        finalHabitDate = new Date(habitDate);
        finalHabitDate.setHours(0, 0, 0, 0);
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        finalHabitDate = today;
      }
    }

    const habit = new Habit({
      user: req.user.id,
      name,
      category: category || 'Other',
      completedToday: false,
      habitDate: finalHabitDate,
      isArchived: false,
      isRecurring: isRecurring || false,
      frequency: isRecurring ? (frequency || 'daily') : null,
      daysOfWeek: isRecurring && daysOfWeek ? daysOfWeek : [],
      linkedGoalId: linkedGoalId || null,
      goalContribution: goalContribution || 10
    });

    await habit.save();

    // Populate linkedGoalId for response
    await habit.populate('linkedGoalId', 'name');

    console.log('✅ Habit created:', habit);
    res.status(201).json(habit);
  } catch (error) {
    console.error('❌ Error creating habit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle habit completion
router.patch('/:id/toggle', authenticate, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id })
      .populate('linkedGoalId', 'name target current progress unit');

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const wasCompleted = habit.completedToday;
    habit.completedToday = !habit.completedToday;

    if (habit.completedToday) {
      habit.lastCompletedDate = new Date();
    }

    await habit.save();

    // Save real-time snapshot for today so history is always up to date
    try {
      await saveTodaySnapshot(req.user.id);

      const todaySnapshot = await HabitDay.findOne({
        user: req.user.id,
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }).lean();

      // Auto-track habit challenges as soon as user completes all habits for the day.
      if (todaySnapshot && todaySnapshot.totalCount > 0 && todaySnapshot.completionPercentage === 100) {
        const todayStr = new Date().toISOString().split("T")[0];
        await updateChallengeProgress(req.user.id, "habit", todayStr);
      }
    } catch (snapErr) {
      console.error('Snapshot save error (non-fatal):', snapErr.message);
    }

    // Update linked goal if habit was just completed (using new linkedGoalId field)
    let updatedGoal = null;
    if (habit.completedToday && !wasCompleted && habit.linkedGoalId) {
      const Goal = (await import('../models/Goal.js')).default;
      const goal = await Goal.findById(habit.linkedGoalId);

      if (goal && goal.user.toString() === req.user.id) {
        // Calculate contribution based on goalContribution percentage
        // For percentage-based contribution, we update the progress directly
        const contributionPercent = habit.goalContribution || 10;

        // Update progress by the contribution percentage
        goal.progress = Math.min(100, Math.max(0, goal.progress + contributionPercent));

        // Update current value proportionally
        if (goal.target > 0) {
          const progressRatio = goal.progress / 100;
          goal.current = Math.min(goal.target, Math.round(goal.target * progressRatio));
        }

        // Update status if completed
        if (goal.progress >= 100) {
          goal.status = 'completed';
          goal.current = goal.target;
          goal.progress = 100;
        } else if (goal.status === 'completed' && goal.progress < 100) {
          goal.status = 'active';
        }

        await goal.save();
        updatedGoal = goal;
      }
    }

    // Also handle old linkedGoals array for backward compatibility
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

    res.json({ habit, updatedGoal, updatedGoals });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update habit
router.put('/:id', authenticate, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const {
      name,
      category,
      habitDate,
      isRecurring,
      frequency,
      daysOfWeek,
      linkedGoalId,
      goalContribution,
      isArchived
    } = req.body;

    if (name !== undefined) habit.name = name;
    if (category !== undefined) habit.category = category;
    if (isArchived !== undefined) habit.isArchived = isArchived;

    if (isRecurring !== undefined) {
      habit.isRecurring = isRecurring;
      if (isRecurring) {
        habit.frequency = frequency || 'daily';
        habit.daysOfWeek = daysOfWeek || [];
        // For recurring habits, habitDate is not used
      } else {
        habit.frequency = null;
        habit.daysOfWeek = [];
        if (habitDate) {
          const date = new Date(habitDate);
          date.setHours(0, 0, 0, 0);
          habit.habitDate = date;
        }
      }
    }

    if (linkedGoalId !== undefined) habit.linkedGoalId = linkedGoalId || null;
    if (goalContribution !== undefined) habit.goalContribution = goalContribution || 10;

    await habit.save();
    await habit.populate('linkedGoalId', 'name');

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete habit
router.delete('/:id', authenticate, async (req, res) => {
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
        // ✅ BEFORE creating the fallback snapshot, get yesterdayDayOfWeek
        const yesterdayDayOfWeek = yesterday.getDay();

        if (!yesterdaySnapshot && totalYesterday > 0) {
          // ✅ Filter to only habits that actually applied yesterday
          const relevantYesterdayHabits = habits.filter(h => {
            if (h.isArchived) return false;
            if (h.isRecurring) {
              if (h.frequency === 'daily') return true;
              if (
                (h.frequency === 'weekly' || h.frequency === 'custom') &&
                h.daysOfWeek.includes(yesterdayDayOfWeek)
              ) return true;
              return false;
            }
            // One-time: must match yesterday's date
            const hDate = h.habitDate
              ? new Date(h.habitDate).setHours(0, 0, 0, 0)
              : null;
            return hDate === yesterdayTimestamp;
          });

          const yesterdayHabits = relevantYesterdayHabits.map(h => {
            let wasCompleted = false;
            if (h.lastCompletedDate) {
              const completedDate = new Date(h.lastCompletedDate);
              completedDate.setHours(0, 0, 0, 0);
              wasCompleted = completedDate.getTime() === yesterdayTimestamp;
            }
            return { habitId: h._id, name: h.name, completed: wasCompleted };
          });

          const completedCount = yesterdayHabits.filter(h => h.completed).length;
          const totalCount = relevantYesterdayHabits.length;
          const completionPercentage = totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0;

          if (totalCount > 0) {
            try {
              yesterdaySnapshot = await HabitDay.create({
                user: req.user.id,
                date: yesterday,
                habits: yesterdayHabits,
                completionPercentage,
                completedCount,
                totalCount
              });
            } catch (err) {
              if (err.code === 11000) {
                yesterdaySnapshot = await HabitDay.findOne({
                  user: req.user.id,
                  date: yesterday
                });
              } else {
                throw err;
              }
            }
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

// Get historical habit data - paginated, 7 days default
router.get('/history', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    const todaySnap = new Date();
    todaySnap.setHours(0, 0, 0, 0);

    const total = await HabitDay.countDocuments({
      user: req.user.id,
      date: { $lt: todaySnap }
    });

    const habitDays = await HabitDay.find({
      user: req.user.id,
      date: { $lt: todaySnap }
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('habits.habitId', 'name');

    res.json({
      data: habitDays,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total
    });
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
      .populate('linkedGoalId', 'name target current progress unit')
      .select('linkedGoals linkedGoalId');

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Return both old linkedGoals array and new linkedGoalId
    res.json({
      linkedGoals: habit.linkedGoals || [],
      linkedGoal: habit.linkedGoalId || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;