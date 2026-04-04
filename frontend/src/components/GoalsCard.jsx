import React, { useState } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../contexts/GoalsContext';

const GoalsCard = () => {
  const navigate = useNavigate();
  const { goals, addGoal } = useGoals();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', unit: '' });

  const activeGoals = goals.filter(g => g.status === 'active');
  const avgProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((sum, g) => sum + g.progress, 0) /
            activeGoals.length
        )
      : 0;

  const handleAddGoal = () => {
    if (newGoal.name.trim() && newGoal.target) {
      addGoal({
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        unit: newGoal.unit || 'units',
      });
      setNewGoal({ name: '', target: '', unit: '' });
      setShowAddForm(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  return (
    <div className="bg-[#f9d9e3] p-10 rounded-[40px] w-full h-[240px] flex flex-col">
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide opacity-80">
          Active Goals
        </h3>
        <button
          onClick={() => navigate('/goals')}
          className="text-xs text-gray-600 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-600" />
        <span className="text-2xl font-bold text-gray-900">
          {avgProgress}%
        </span>
        <span className="text-xs text-gray-600">Average</span>
      </div>

      {/* Add Goal Quick Form */}
      {showAddForm && (
        <div className="mb-3 bg-white rounded-lg p-3">
          <input
            type="text"
            value={newGoal.name}
            onChange={(e) =>
              setNewGoal({ ...newGoal, name: e.target.value })
            }
            placeholder="Goal name..."
            className="w-full px-3 py-2 border rounded text-sm mb-2"
          />
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target: e.target.value })
              }
              placeholder="Target"
              className="flex-1 px-3 py-2 border rounded text-sm"
            />
            <input
              type="text"
              value={newGoal.unit}
              onChange={(e) =>
                setNewGoal({ ...newGoal, unit: e.target.value })
              }
              placeholder="Unit"
              className="flex-1 px-3 py-2 border rounded text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddGoal}
              className="px-3 py-1 bg-pink-600 text-white rounded text-sm hover:bg-pink-700"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Goals List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent">
        {activeGoals.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-700">
                {goal.name}
              </span>
              <span className="text-xs font-bold text-gray-500">
                {goal.progress || 0}%
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-1">
              {goal.current || 0} / {goal.target} {goal.unit}
            </div>
            {goal.deadline && (() => {
              const daysRemaining = calculateDaysRemaining(goal.deadline);
              return (
                <div className="text-xs text-gray-500 mb-1">
                  Due: {formatDate(goal.deadline)}
                  {daysRemaining !== null && (
                    <span className="ml-1">
                      {daysRemaining < 0 
                        ? `(${Math.abs(daysRemaining)} days overdue)`
                        : daysRemaining === 0
                        ? '(Due today)'
                        : `(${daysRemaining} days left)`}
                    </span>
                  )}
                </div>
              );
            })()}
            <div className="h-2 w-full bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-gray-50 rounded-lg text-gray text-sm transition-all mt-3"
      >
        <Plus className="w-4 h-4" />
        Quick Add
      </button>
    </div>
  );
};

export default GoalsCard;