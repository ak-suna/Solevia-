import React, { createContext, useState, useContext, useEffect } from 'react';
import { getGoals, createGoal, updateGoalProgress as updateProgressAPI, deleteGoal as deleteGoalAPI } from '../services/goalService';

const GoalsContext = createContext();

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within GoalsProvider');
  }
  return context;
};

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load goals from database on mount
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals();
      setGoals(data.map(g => ({
        ...g,
        id: g._id // Map MongoDB _id to id
      })));
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData) => {
    try {
      const newGoal = await createGoal(goalData);
      setGoals([{ ...newGoal, id: newGoal._id }, ...goals]);
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  const updateProgress = async (id, increment) => {
    try {
      const updated = await updateProgressAPI(id, increment);
      setGoals(goals.map(g => 
        g.id === id ? { ...updated, id: updated._id } : g
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await deleteGoalAPI(id);
      setGoals(goals.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal, updateProgress, deleteGoal, loading, loadGoals }}>
      {children}
    </GoalsContext.Provider>
  );
};