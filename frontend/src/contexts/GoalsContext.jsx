import React, { createContext, useState, useContext } from 'react';

const GoalsContext = createContext();

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within GoalsProvider');
  }
  return context;
};

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([
    { id: 1, name: 'Read 12 books this year', progress: 65, status: 'active', target: 12, current: 8, unit: 'books' },
    { id: 2, name: 'Exercise 4x per week', progress: 80, status: 'active', target: 4, current: 3.2, unit: 'times/week' },
  ]);

  const addGoal = (goalData) => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      progress: 0,
      current: 0,
      status: 'active'
    };
    setGoals([...goals, newGoal]);
  };

  const updateProgress = (id, increment) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const newProgress = Math.min(100, Math.max(0, g.progress + increment));
        return { ...g, progress: newProgress };
      }
      return g;
    }));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal, updateProgress, deleteGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};