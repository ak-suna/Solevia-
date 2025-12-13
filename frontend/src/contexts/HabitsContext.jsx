import React, { createContext, useState, useContext } from 'react';

const HabitsContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitsProvider');
  }
  return context;
};

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', completedToday: true, streak: 5 },
    { id: 2, name: 'Drink 8 glasses of water', completedToday: true, streak: 12 },
    { id: 3, name: 'Evening walk', completedToday: false, streak: 3 },
  ]);

  const addHabit = (name) => {
    const newHabit = {
      id: Date.now(),
      name,
      completedToday: false,
      streak: 0
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completedToday: !h.completedToday } : h
    ));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <HabitsContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit }}>
      {children}
    </HabitsContext.Provider>
  );
};