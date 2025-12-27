import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useGoals } from '../contexts/GoalsContext';

const GoalsPage = () => {
  const { goals, addGoal, updateProgress, deleteGoal } = useGoals();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', unit: '' });

  const handleAddGoal = () => {
    if (newGoal.name.trim() && newGoal.target) {
      addGoal({
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        unit: newGoal.unit || 'units'
      });
      setNewGoal({ name: '', target: '', unit: '' });
      setShowAddForm(false);
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.progress === 100).length;
  const avgProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;

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
              <TrendingUp className="w-8 h-8 text-[#f096b3] dark:text-[#f4873e]" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals</h1>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-[#f4873e] dark:bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-[#e67a35] dark:hover:bg-orange-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </motion.button>
        </motion.div>

        {/* Add Goal Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-6 overflow-hidden"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Add New Goal</h3>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                placeholder="Goal name (e.g., Read 12 books this year)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#f4873e] outline-none"
              />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  placeholder="Target (e.g., 12)"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#f4873e] outline-none"
                />
                <input
                  type="text"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  placeholder="Unit (e.g., books)"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#f4873e] outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddGoal}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoal({ name: '', target: '', unit: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overview Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Goals</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeGoals.length}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg Progress</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgProgress}%</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedGoals}</p>
          </div>
        </motion.div>

        {/* Goals List */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Active Goals</h2>

          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No goals yet. Create your first goal!</p>
              </div>
            ) : (
              <AnimatePresence>
                {goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 bg-white dark:bg-gray-600 rounded-xl hover:shadow-md transition-all group border-2 border-transparent hover:border-[#f4873e]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {goal.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#f4873e]">
                          {goal.progress}%
                        </span>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                          title="Delete goal"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-3 mb-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#f4873e] to-pink-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                        style={{ width: `${goal.progress}%` }}
                      >
                        {goal.progress === 100 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        )}
                      </div>
                    </div>

                    {/* Update Progress Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => updateProgress(goal.id, -10)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-500 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-400 text-sm font-medium transition-all"
                      >
                        -10%
                      </button>
                      <button
                        onClick={() => updateProgress(goal.id, -5)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-500 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-400 text-sm font-medium transition-all"
                      >
                        -5%
                      </button>
                      <button
                        onClick={() => updateProgress(goal.id, 5)}
                        className="px-3 py-1 bg-[#f4873e] text-white rounded-lg hover:bg-[#e67a35] text-sm font-medium transition-all"
                      >
                        +5%
                      </button>
                      <button
                        onClick={() => updateProgress(goal.id, 10)}
                        className="px-3 py-1 bg-[#f4873e] text-white rounded-lg hover:bg-[#e67a35] text-sm font-medium transition-all"
                      >
                        +10%
                      </button>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        Update progress
                      </span>
                    </div>

                    {/* Completion Badge */}
                    {goal.progress === 100 && (
                      <div className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-semibold">Goal Completed! 🎉</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Motivational Footer */}
        {activeGoals.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-xl border-2 border-orange-100 dark:border-orange-800"
          >
            <p className="text-center text-gray-700 dark:text-gray-300">
              💪 Keep pushing! You're {avgProgress}% of the way there on average.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;