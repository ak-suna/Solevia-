import React, { createContext, useState, useContext, useEffect } from 'react';
import { getHabits, createHabit, toggleHabit as toggleHabitAPI, deleteHabit as deleteHabitAPI } from '../services/habitService';

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

  // Load habits from database on mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await getHabits();
      setHabits(data.map(h => ({
        ...h,
        id: h._id, // Map MongoDB _id to id
        completedToday: h.completedToday || false,
        streak: h.streak || 0
      })));
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (name) => {
    try {
      const newHabit = await createHabit(name);
      setHabits([{ ...newHabit, id: newHabit._id }, ...habits]);
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  const toggleHabit = async (id) => {
    try {
      const updated = await toggleHabitAPI(id);
      setHabits(habits.map(h => 
        h.id === id ? { ...updated, id: updated._id } : h
      ));
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
    <HabitsContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit, loading, loadHabits }}>
      {children}
    </HabitsContext.Provider>
  );
};