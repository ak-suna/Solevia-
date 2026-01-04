import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getTodayHabits, createHabit, toggleHabit as toggleHabitAPI, deleteHabit as deleteHabitAPI } from '../services/habitService';

const HabitsContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitsProvider');
  }
  return context;
};

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  // ADD THESE TWO LINES:
  const [globalStreak, setGlobalStreak] = useState({ current: 0, best: 0 });

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      // Use getTodayHabits to only get today's habits (one-time + recurring)
      const data = await getTodayHabits();
      setHabits(data.map(h => ({
        ...h,
        id: h._id,
        completedToday: h.completedToday || false
      })));
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for new day and update streak
  const checkNewDay = useCallback(async () => {
    try {
      const { checkNewDay } = await import('../services/habitService');
      const streak = await checkNewDay();
      setGlobalStreak(streak);
      // Reload habits after day check to get updated completedToday
      await loadHabits();
    } catch (error) {
      console.error('Error checking new day:', error);
    }
  }, [loadHabits]);

  // Load habits and check day on mount
  useEffect(() => {
    loadHabits();
    checkNewDay();
  }, [loadHabits, checkNewDay]);

  const addHabit = async (habitData) => {
    try {
      const newHabit = await createHabit(habitData);
      // Only add to list if it's for today or recurring
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const habitDate = newHabit.habitDate ? new Date(newHabit.habitDate).setHours(0, 0, 0, 0) : null;
      const todayTimestamp = today.getTime();
      
      if (newHabit.isRecurring || (habitDate && habitDate === todayTimestamp)) {
        setHabits([{ ...newHabit, id: newHabit._id }, ...habits]);
      }
      // Reload habits to ensure we have the correct filtered list
      await loadHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  const toggleHabit = async (id) => {
    try {
      const response = await toggleHabitAPI(id);
      // Response now contains { habit, updatedGoal, updatedGoals }
      const updatedHabit = response.habit || response; // Handle backward compatibility
      setHabits(habits.map(h => 
        h.id === id ? { ...updatedHabit, id: updatedHabit._id } : h
      ));
      return response;
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  };

  const deleteHabit = async (id) => {
    try {
      await deleteHabitAPI(id);
      setHabits(habits.filter(h => h.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  return (
    <HabitsContext.Provider value={{ 
      habits, 
      addHabit, 
      toggleHabit, 
      deleteHabit, 
      loading, 
      loadHabits,
      globalStreak // ADD THIS
    }}>
      {children}
    </HabitsContext.Provider>
  );
};