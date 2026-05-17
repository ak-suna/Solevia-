import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../contexts/HabitsContext';

const HabitsCard = () => {
  const navigate = useNavigate();
  const { habits, toggleHabit, addHabit, globalStreak } = useHabits();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const completedToday = habits.filter(h => h.completedToday).length;
  const total = habits.length;
  const percentage = total > 0
    ? Math.round((completedToday / total) * 100)
    : 0;

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({ name: newHabitName, category: 'Other' }); setNewHabitName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-[#89beab] dark:bg-gray-800 p-10 rounded-[40px] w-full h-[238px] flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-bold text-[#1F3B36] dark:text-white uppercase tracking-wide opacity-80">
          Today's Habits
        </h3>
        <button
          onClick={() => navigate('/tasks')}
          className="text-xs text-white dark:text-gray-200 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-white dark:text-gray-200">{completedToday}/{total} completed ({percentage}%)</span>
          <span className="font-semibold text-white dark:text-gray-200">{percentage}%</span>
        </div>
        <div className="w-full bg-white/30 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-[#DB996E] dark:bg-orange-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {globalStreak && globalStreak.current > 0 && (
          <div className="mt-2 text-xs text-white/90 dark:text-orange-300">
            🔥 {globalStreak.current} days streak
          </div>
        )}
      </div>

      {/* Add Habit Quick Form */}
      {showAddForm && (
        <div className="mb-3 bg-white/20 dark:bg-gray-700/40 rounded-lg p-3">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New habit..."
            className="w-full px-3 py-2 rounded text-sm mb-2 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddHabit}
              className="px-3 py-1 bg-[#DB996E] dark:bg-orange-400 text-white rounded text-sm hover:bg-[#c8875c] dark:hover:bg-orange-500"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-white/30 dark:bg-gray-700/40 text-white dark:text-gray-200 rounded text-sm hover:bg-white/40 dark:hover:bg-gray-800/60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/30 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => toggleHabit(habit.id)}
          >
            {habit.completedToday ? (
              <CheckCircle2 className="w-5 h-5 text-[#DB996E] dark:text-orange-400" />
            ) : (
              <Circle className="w-5 h-5 text-white/50 dark:text-gray-500" />
            )}
            <span className={`text-sm ${habit.completedToday
              ? 'text-white/70 dark:text-orange-200 line-through'
              : 'text-white dark:text-gray-100 font-medium'
              }`}>
              {habit.name}
            </span>
          </div>
        ))}
      </div>


      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full flex items-center justify-center gap-1 py-1.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 text-sm transition-all"
      >
        <Plus className="w-4 h-4" />
        Quick Add
      </button>
    </div>
  );
};

export default HabitsCard;
