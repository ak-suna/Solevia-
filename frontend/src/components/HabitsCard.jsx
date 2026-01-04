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
      addHabit(newHabitName, 'Other');
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-[#89beab] p-10 rounded-[40px] w-full h-[238px] flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-bold text-[#1F3B36] uppercase tracking-wide opacity-80">
          Today's Habits
        </h3>
        <button
          onClick={() => navigate('/tasks')}
          className="text-xs text-white hover:underline"
        >
          View All
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-white">{completedToday}/{total} completed ({percentage}%)</span>
          <span className="font-semibold text-white">{percentage}%</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-2">
          <div
            className="bg-[#DB996E] h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {globalStreak && globalStreak.current > 0 && (
          <div className="mt-2 text-xs text-white/90">
            🔥 {globalStreak.current} days streak
          </div>
        )}
      </div>

      {/* Add Habit Quick Form */}
      {showAddForm && (
        <div className="mb-3 bg-white/20 rounded-lg p-3">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New habit..."
            className="w-full px-3 py-2 rounded text-sm mb-2 outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddHabit}
              className="px-3 py-1 bg-[#DB996E] text-white rounded text-sm hover:bg-[#c8875c]"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-white/30 text-white rounded text-sm hover:bg-white/40"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

<div className="flex-1 overflow-y-auto space-y-2 pr-1  scrollbar-thin
    scrollbar-thumb-white/30
    scrollbar-track-transparent">
  {habits.map((habit) => (
    <div
      key={habit.id}
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => toggleHabit(habit.id)}
    >
      {habit.completedToday ? (
        <CheckCircle2 className="w-5 h-5 text-[#DB996E]" />
      ) : (
        <Circle className="w-5 h-5 text-white/50" />
      )}
      <span className={`text-sm ${
        habit.completedToday 
          ? 'text-white/70 line-through' 
          : 'text-white font-medium'
      }`}>
        {habit.name}
      </span>
    </div>
  ))}
</div>


      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full flex items-center justify-center gap-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-all"
      >
        <Plus className="w-4 h-4" />
        Add
      </button>
    </div>
  );
};

export default HabitsCard;
