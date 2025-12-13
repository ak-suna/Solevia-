import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Plus, Trash2, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useHabits } from '../contexts/HabitsContext';

const HabitsPage = () => {
  const navigate = useNavigate();
  const { habits, addHabit, toggleHabit, deleteHabit } = useHabits();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName);
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const percentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
      <Sidebar />

      <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
          style={{ fontFamily: "Brasika" }}
        >
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Habits</h1>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-[#89beab] dark:bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-[#7aad99] dark:hover:bg-teal-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Habit
          </motion.button>
        </motion.div>

        {/* Add Habit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-6 overflow-hidden"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Add New Habit</h3>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Enter habit name..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#89beab] outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddHabit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewHabitName('');
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Overview */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Progress</h2>
            <span className="text-3xl font-bold text-[#89beab]">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-[#89beab] to-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount} of {habits.length} habits completed
          </p>
        </motion.div>

        {/* Habits List */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Habit Checklist</h2>

          <div className="space-y-3">
            {habits.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No habits yet. Create your first habit!</p>
              </div>
            ) : (
              <AnimatePresence>
                {habits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-600 rounded-xl hover:shadow-md transition-all group border-2 border-transparent hover:border-[#89beab]"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className="flex-shrink-0"
                      >
                        {habit.completedToday ? (
                          <CheckCircle2 className="w-7 h-7 text-green-500" />
                        ) : (
                          <Circle className="w-7 h-7 text-gray-300 dark:text-gray-500 hover:text-gray-400" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <p className={`font-medium ${
                          habit.completedToday 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span>{habit.streak} day streak</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                      title="Delete habit"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">5 days</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Best Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">12 days</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">78%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;