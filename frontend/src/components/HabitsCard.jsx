import React, { useState } from 'react';
import { Check } from 'lucide-react';

const HabitsCard = () => {
  const [habits, setHabits] = useState([
    { id: 1, text: 'Morning Meditation', completed: true },
    { id: 2, text: 'Drink 8 glasses of water', completed: true },
    { id: 3, text: 'Evening walk', completed: false },
  ]);

  const toggleHabit = (id) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  return (
    <div className="bg-[#89beab] p-10 rounded-[40px] w-full">
      <h3 className="text-sm font-bold text-[#1F3B36] mb-4 uppercase tracking-wide opacity-80">
        Today's Habits
      </h3>
      <div className="space-y-3">
        {habits.map((habit) => (
          <div 
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div 
              className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${
                habit.completed 
                  ? 'bg-[#DB996E] border-[#DB996E]' 
                  : 'border-gray-400 bg-transparent group-hover:border-[#DB996E]'
              }`}
            >
              {habit.completed && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <span className={`text-sm transition-colors ${
              habit.completed ? 'text-white-10 line-through' : 'text-white font-medium'
            }`}>
              {habit.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitsCard;