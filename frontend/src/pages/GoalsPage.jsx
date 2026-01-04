import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle2, Plus, Trash2, Link2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useGoals } from '../contexts/GoalsContext';
import { useHabits } from '../contexts/HabitsContext';
import { linkHabitsToGoal, getLinkedHabits } from '../services/goalService';

const GoalsPage = () => {
  const { goals, addGoal, updateProgress, deleteGoal, loadGoals } = useGoals();
  const { habits } = useHabits();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', unit: '', deadline: '', category: 'Other' });

  const handleAddGoal = () => {
    if (newGoal.name.trim() && newGoal.target) {
      addGoal({
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        unit: newGoal.unit || 'units',
        deadline: newGoal.deadline || null,
        category: newGoal.category || 'Other'
      });
      setNewGoal({ name: '', target: '', unit: '', deadline: '', category: 'Other' });
      setShowAddForm(false);
    }
  };

  const categoryColors = {
    Fitness: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
    Health: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
    Learning: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    Career: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700',
    Finance: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    Personal: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 border-pink-300 dark:border-pink-700',
    Other: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (deadline, progress) => {
    if (!deadline) return null;
    const daysRemaining = calculateDaysRemaining(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    // Overdue and not complete
    if (deadlineDate < today && progress < 100) {
      return 'overdue';
    }
    
    // Calculate expected progress (simple linear projection)
    // This is a simplified calculation - you could make it more sophisticated
    const totalDays = Math.max(1, Math.ceil((deadlineDate - new Date(deadlineDate.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24)));
    const elapsedDays = totalDays - daysRemaining;
    const expectedProgress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
    
    // Behind schedule
    if (progress < expectedProgress && daysRemaining >= 0) {
      return 'behind';
    }
    
    // On track
    return 'ontrack';
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedHabitIds, setSelectedHabitIds] = useState([]);
  const [contributionValues, setContributionValues] = useState({});
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.progress === 100).length;
  const avgProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;
  
  const categories = ['All', 'Fitness', 'Health', 'Learning', 'Career', 'Finance', 'Personal', 'Other'];
  const filteredGoals = selectedCategory === 'All' 
    ? goals 
    : goals.filter(g => g.category === selectedCategory);

  const handleLinkHabits = async (goal) => {
    try {
      const linkedHabits = await getLinkedHabits(goal.id);
      setSelectedGoal(goal);
      setSelectedHabitIds(linkedHabits.map(link => link.habitId._id || link.habitId));
      const values = {};
      linkedHabits.forEach(link => {
        values[link.habitId._id || link.habitId] = link.contributionValue || 1;
      });
      setContributionValues(values);
      setShowLinkModal(true);
    } catch (error) {
      console.error('Error loading linked habits:', error);
      setSelectedGoal(goal);
      setSelectedHabitIds([]);
      setContributionValues({});
      setShowLinkModal(true);
    }
  };

  const handleSaveLinks = async () => {
    if (!selectedGoal) return;
    
    try {
      const values = selectedHabitIds.map(id => contributionValues[id] || 1);
      await linkHabitsToGoal(selectedGoal.id, selectedHabitIds, values);
      await loadGoals();
      setShowLinkModal(false);
      setSelectedGoal(null);
      setSelectedHabitIds([]);
      setContributionValues({});
    } catch (error) {
      console.error('Error linking habits:', error);
      alert('Failed to link habits. Please try again.');
    }
  };

  const toggleHabitSelection = (habitId) => {
    if (selectedHabitIds.includes(habitId)) {
      setSelectedHabitIds(selectedHabitIds.filter(id => id !== habitId));
      const newValues = { ...contributionValues };
      delete newValues[habitId];
      setContributionValues(newValues);
    } else {
      setSelectedHabitIds([...selectedHabitIds, habitId]);
      setContributionValues({ ...contributionValues, [habitId]: 1 });
    }
  };

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
            className="flex items-center gap-2 bg-[#89beab]  text-black px-6 py-3 rounded-xl hover:bg-[#FFA669] dark:hover:bg-orange-700 transition-all"
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
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  placeholder="Deadline (optional)"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#f4873e] outline-none"
                />
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#f4873e] outline-none"
                >
                  <option value="Fitness">Fitness</option>
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                  <option value="Career">Career</option>
                  <option value="Finance">Finance</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
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
                    setNewGoal({ name: '', target: '', unit: '', deadline: '', category: 'Other' });
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
              <TrendingUp className="w-6 h-6 text-black" />
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

        {/* Category Filter */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by category:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#FFA669] text-white'
                    : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Goals List */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "Brasika" }}>
            {selectedCategory === 'All' ? 'All Goals' : `${selectedCategory} Goals`}
          </h2>

          <div className="space-y-4">
            {filteredGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No goals yet. Create your first goal!</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-5 bg-white dark:bg-gray-600 rounded-xl hover:shadow-md transition-all group border-2 ${
                      goal.deadline ? (
                        getDeadlineStatus(goal.deadline, goal.progress || 0) === 'overdue'
                          ? 'border-red-300 dark:border-red-700'
                          : getDeadlineStatus(goal.deadline, goal.progress || 0) === 'behind'
                          ? 'border-yellow-300 dark:border-yellow-700'
                          : 'border-green-300 dark:border-green-700'
                      ) : 'border-transparent'
                    } hover:border-[#f4873e]`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {goal.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${categoryColors[goal.category] || categoryColors.Other}`}>
                            {goal.category || 'Other'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Current: {goal.current || 0} | Target: {goal.target} {goal.unit} | Progress: {goal.progress || 0}%
                        </p>
                        {goal.deadline && (() => {
                          const daysRemaining = calculateDaysRemaining(goal.deadline);
                          const status = getDeadlineStatus(goal.deadline, goal.progress || 0);
                          const statusColors = {
                            overdue: 'text-red-600 dark:text-red-400',
                            behind: 'text-yellow-600 dark:text-yellow-400',
                            ontrack: 'text-green-600 dark:text-green-400'
                          };
                          return (
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`font-semibold ${statusColors[status] || 'text-gray-600 dark:text-gray-400'}`}>
                                Due: {formatDate(goal.deadline)}
                              </span>
                              <span className={`font-medium ${statusColors[status] || 'text-gray-600 dark:text-gray-400'}`}>
                                {daysRemaining !== null && (
                                  daysRemaining < 0 
                                    ? `${Math.abs(daysRemaining)} days overdue`
                                    : daysRemaining === 0
                                    ? 'Due today'
                                    : `${daysRemaining} days left`
                                )}
                              </span>
                            </div>
                          );
                        })()}
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
                        className="bg-gradient-to-r from-[#a5c7bb] to-[#46c294] h-3 rounded-full transition-all duration-500 relative overflow-hidden"
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
                        onClick={() => updateProgress(goal.id, -5)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-500 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-400 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(goal.current || 0) <= 0}
                      >
                        -5
                      </button>
                      <button
                        onClick={() => updateProgress(goal.id, -1)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-500 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-400 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(goal.current || 0) <= 0}
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateProgress(goal.id, 1)}
                        className="px-3 py-1 bg-[#FFA669] text-white rounded-lg hover:bg-[#fd9048] text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(goal.current || 0) >= goal.target}
                      >
                        +1
                      </button>
                      <button
                        onClick={() => updateProgress(goal.id, 5)}
                        className="px-3 py-1 bg-[#FFA669] text-white rounded-lg hover:bg-[#fd9048] text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(goal.current || 0) >= goal.target}
                      >
                        +5
                      </button>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        Update value
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