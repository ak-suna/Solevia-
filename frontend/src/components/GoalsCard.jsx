import React from 'react';

const GoalsCard = () => {
  return (
    <div className="bg-[#FFF5F5] p-6 rounded-3xl w-full">
      <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wide opacity-80">
        Active Goals
      </h3>
      
      <div className="space-y-6">
        {/* Goal 1 */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-gray-700">Read 12 books this year</span>
            <span className="text-xs font-bold text-gray-500">65%</span>
          </div>
          <div className="h-2 w-full bg-white rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FF6B6B] rounded-full" 
              style={{ width: '65%' }}
            />
          </div>
        </div>

        {/* Goal 2 */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-gray-700">Exercise 4x per week</span>
            <span className="text-xs font-bold text-gray-500">80%</span>
          </div>
          <div className="h-2 w-full bg-white rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#EC4899] rounded-full" 
              style={{ width: '80%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsCard;