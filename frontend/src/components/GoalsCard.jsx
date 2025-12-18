// // import React from 'react';
// // import { TrendingUp } from 'lucide-react';

// // const GoalsCard = ({ goals, onNavigate }) => {
// //   const activeGoals = goals.filter(g => g.status === 'active');
// //   const avgProgress = activeGoals.length > 0 
// //     ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
// //     : 0;

// //   return (
// //     <div className="bg-[#f9d9e3] p-10 rounded-[40px] w-full">
// //       <div className="flex justify-between items-start mb-3">
// //         <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide opacity-80">
// //           Active Goals
// //         </h3>
// //         <button 
// //           onClick={onNavigate}
// //           className="text-xs text-gray-600 hover:underline"
// //         >
// //           View All
// //         </button>
// //       </div>

// //       <div className="flex items-center gap-2 mb-4">
// //         <TrendingUp className="w-5 h-5 text-pink-600" />
// //         <span className="text-2xl font-bold text-gray-900">{avgProgress}%</span>
// //         <span className="text-xs text-gray-600">Average</span>
// //       </div>

// //       <div className="space-y-4">
// //         {activeGoals.slice(0, 2).map((goal) => (
// //           <div key={goal.id}>
// //             <div className="flex justify-between items-end mb-2">
// //               <span className="text-sm font-medium text-gray-700">{goal.name}</span>
// //               <span className="text-xs font-bold text-gray-500">{goal.progress}%</span>
// //             </div>
// //             <div className="h-2 w-full bg-white rounded-full overflow-hidden">
// //               <div 
// //                 className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-300" 
// //                 style={{ width: `${goal.progress}%` }}
// //               />
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default GoalsCard;
// import React, { useState } from 'react';
// import { TrendingUp, Plus } from 'lucide-react';
// import { useGoals } from '../contexts/GoalsContext';

// const GoalsCard = ({ onNavigate }) => {
//   const { goals, addGoal } = useGoals();
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newGoal, setNewGoal] = useState({ name: '', target: '', unit: '' });

//   const activeGoals = goals.filter(g => g.status === 'active');
//   const avgProgress = activeGoals.length > 0 
//     ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
//     : 0;

//   const handleAddGoal = () => {
//     if (newGoal.name.trim() && newGoal.target) {
//       addGoal({
//         name: newGoal.name,
//         target: parseFloat(newGoal.target),
//         unit: newGoal.unit || 'units'
//       });
//       setNewGoal({ name: '', target: '', unit: '' });
//       setShowAddForm(false);
//     }
//   };

//   return (
//     <div className="bg-[#f9d9e3] p-10 rounded-[40px] w-full">
//       <div className="flex justify-between items-start mb-3">
//         <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide opacity-80">
//           Active Goals
//         </h3>
//         <button 
//           onClick={onNavigate}
//           className="text-xs text-gray-600 hover:underline"
//         >
//           View All
//         </button>
//       </div>

//       <div className="flex items-center gap-2 mb-4">
//         <TrendingUp className="w-5 h-5 text-pink-600" />
//         <span className="text-2xl font-bold text-gray-900">{avgProgress}%</span>
//         <span className="text-xs text-gray-600">Average</span>
//       </div>

//       {/* Add Goal Quick Form */}
//       {showAddForm && (
//         <div className="mb-3 bg-white rounded-lg p-3">
//           <input
//             type="text"
//             value={newGoal.name}
//             onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
//             placeholder="Goal name..."
//             className="w-full px-3 py-2 border rounded text-sm mb-2"
//           />
//           <div className="flex gap-2 mb-2">
//             <input
//               type="number"
//               value={newGoal.target}
//               onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
//               placeholder="Target"
//               className="flex-1 px-3 py-2 border rounded text-sm"
//             />
//             <input
//               type="text"
//               value={newGoal.unit}
//               onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
//               placeholder="Unit"
//               className="flex-1 px-3 py-2 border rounded text-sm"
//             />
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={handleAddGoal}
//               className="px-3 py-1 bg-pink-600 text-white rounded text-sm hover:bg-pink-700"
//             >
//               Add
//             </button>
//             <button
//               onClick={() => setShowAddForm(false)}
//               className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="space-y-4 mb-3">
//         {activeGoals.slice(0, 2).map((goal) => (
//           <div key={goal.id}>
//             <div className="flex justify-between items-end mb-2">
//               <span className="text-sm font-medium text-gray-700">{goal.name}</span>
//               <span className="text-xs font-bold text-gray-500">{goal.progress}%</span>
//             </div>
//             <div className="h-2 w-full bg-white rounded-full overflow-hidden">
//               <div 
//                 className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-300" 
//                 style={{ width: `${goal.progress}%` }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Button */}
//       <button
//         onClick={() => setShowAddForm(!showAddForm)}
//         className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-gray-50 rounded-lg text-gray-700 text-sm transition-all"
//       >
//         <Plus className="w-4 h-4" />
//         Quick Add
//       </button>
//     </div>
//   );
// };

// export default GoalsCard;
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

  return (
    <div className="bg-[#f9d9e3] p-10 rounded-[40px] w-full height-[250px]">
      
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

      <div className="space-y-4 mb-3">
        {activeGoals.slice(0, 2).map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-700">
                {goal.name}
              </span>
              <span className="text-xs font-bold text-gray-500">
                {goal.progress}%
              </span>
            </div>
            <div className="h-2 w-full bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-gray-50 rounded-lg text-gray-700 text-sm transition-all"
      >
        <Plus className="w-4 h-4" />
        Quick Add
      </button>
    </div>
  );
};

export default GoalsCard;
