// // // src/pages/UserDashboard.jsx
// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { logout } from "../services/auth";
// // import Calendar from "../components/Calendar";   // <-- ADD THIS

// // const UserDashboard = () => {
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     logout();
// //     navigate("/login");
// //   };

// //   return (
// //     <div className="p-8">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold">User Dashboard</h1>

// //         <button
// //           onClick={handleLogout}
// //           className="px-4 py-2 bg-red-600 text-white rounded-md"
// //         >
// //           Logout
// //         </button>
// //       </div>

// //       <p className="mb-4">Welcome to your dashboard!</p>

// //       {/* ⬇️ Add FullCalendar here */}
// //       <div className="mt-6">
// //         <Calendar />
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserDashboard;

// // src/pages/UserDashboard.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { logout, getUsername} from "../services/auth";
// import Calendar from "../components/Calendar";

// const UserDashboard = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };
//   const username = getUsername();

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold"> Welcome, {username || "User"} </h1>
//         <button
//           onClick={handleLogout}
//           className="px-4 py-2 bg-red-600 text-white rounded-md"
//         >
//           Logout
//         </button>
//       </div>

//       {/* <p className="mb-4">Hello</p> */}

//       {/* Main content */}
//       <div className="mt-6 flex flex-col lg:flex-row gap-6">
//         {/* Left panel for stats, habits, etc */}
//         <div className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-lg shadow">
//           <h2 className="font-semibold mb-2">Your Stats</h2>
//           <p>Habits, mood, goals, etc.</p>
//         </div>

//         {/* Calendar panel */}
//         <div className="w-full lg:w-3/4 bg-white p-4 rounded-xl shadow-md">
//           <Calendar />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
// src/pages/UserDashboard.jsx
// src/pages/UserDashboard.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout, getUsername } from "../services/auth";
// import Calendar from "../components/Calendar";


// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const username = getUsername();
//   const [selectedDate, setSelectedDate] = useState(null);
  
//   // Empty for now - will be populated when you implement backend
//   const [dateEntries, setDateEntries] = useState({});

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleDateSelect = (dateStr) => {
//     setSelectedDate(dateStr);
//   };

//   const selectedEntry = selectedDate ? dateEntries[selectedDate] : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 p-6">
//       <div className="max-w-7xl mx-auto flex gap-4">
//         {/* Left side navigation icons */}
//         <div className="flex flex-col gap-4 pt-20">
//           {[...Array(5)].map((_, i) => (
//             <div 
//               key={i} 
//               className="w-10 h-10 bg-white rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
//             >
//               {/* Icons will go here later */}
//             </div>
//           ))}
//         </div>

//         {/* Main content area */}
//         <div className="flex-1 bg-white rounded-3xl p-8 shadow-2xl">
//           {/* Header */}
//           <div className="flex justify-between items-start mb-6">
//             <h1 className="text-3xl font-bold text-gray-800">
//               Welcome, {username || "User"}
//             </h1>
            
//             <div className="flex items-center gap-4">
//               {/* Search bar */}
//               <div className="flex gap-2 items-center bg-gray-50 px-4 py-2 rounded-lg">
//                 <span className="text-gray-400">🔍</span>
//                 <input 
//                   type="text" 
//                   placeholder="Search task, routine..."
//                   className="bg-transparent outline-none text-sm w-48"
//                 />
//               </div>
              
//               {/* Logout button */}
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Calendar section */}
//           <div className="mb-6">
//             <Calendar onDateSelect={handleDateSelect} />
//           </div>
//         </div>

//         {/* Right sidebar sections - separate from main content */}
//         <div className="w-64 flex flex-col gap-4 pt-20 h-full">
//           {/* Tasks Section */}
//           <div className="bg-white rounded-2xl p-5 shadow-lg flex-1 min-h-[144px]">
//             <h3 className="font-semibold text-gray-800 mb-3">Tasks</h3>
//             {selectedEntry && selectedEntry.tasks ? (
//               <ul className="space-y-2">
//                 {selectedEntry.tasks.map((task, i) => (
//                   <li key={i} className="text-sm text-gray-600">• {task}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-400">
//                 {selectedDate 
//                   ? "No tasks for this day" 
//                   : "Select a date to view tasks"}
//               </p>
//             )}
//           </div>

//           {/* Goals Section */}
//           <div className="bg-white rounded-2xl p-5 shadow-lg flex-1 min-h-[144px]">
//             <h3 className="font-semibold text-gray-800 mb-3">Goals</h3>
//             {selectedEntry && selectedEntry.goals ? (
//               <ul className="space-y-2">
//                 {selectedEntry.goals.map((goal, i) => (
//                   <li key={i} className="text-sm text-gray-600">• {goal}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-400">
//                 {selectedDate 
//                   ? "No goals for this day" 
//                   : "Select a date to view goals"}
//               </p>
//             )}
//           </div>

//           {/* Habits Section */}
//           <div className="bg-white rounded-2xl p-5 shadow-lg flex-1 min-h-[144px]">
//             <h3 className="font-semibold text-gray-800 mb-3">Habits</h3>
//             {selectedEntry && selectedEntry.habits ? (
//               <ul className="space-y-2">
//                 {selectedEntry.habits.map((habit, i) => (
//                   <li key={i} className="text-sm text-gray-600">✓ {habit}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-400">
//                 {selectedDate 
//                   ? "No habits tracked" 
//                   : "Select a date to view habits"}
//               </p>
//             )}
//           </div>

//           {/* Mood/Journal Section - only shows when date is selected */}
//           {selectedDate && selectedEntry && selectedEntry.mood && (
//             <div className="bg-teal-50 rounded-2xl p-5 shadow-lg">
//               <div className="flex items-center gap-2 mb-3">
//                 <span className="text-2xl">{selectedEntry.mood}</span>
//                 <h3 className="font-semibold text-gray-800 text-sm">Mood & Notes</h3>
//               </div>
//               <p className="text-sm text-gray-600">{selectedEntry.notes}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout, getUsername } from "../services/auth";
// import Calendar from "../components/Calendar";
// import MoodCheckPopup from "../components/MoodCheckPopup";
// import { shouldShowMoodCheck, saveMood } from "../services/moodCheckService";

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const username = getUsername();
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [dateEntries, setDateEntries] = useState({});
  
//   const [showMoodPopup, setShowMoodPopup] = useState(false);
//   const [moodPeriod, setMoodPeriod] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkMoodStatus();
//   }, []);

//   const checkMoodStatus = async () => {
//     try {
//       const checkMood = await shouldShowMoodCheck();
//       if (checkMood.show) {
//         setShowMoodPopup(true);
//         setMoodPeriod(checkMood.period);
//       }
//     } catch (error) {
//       console.error("Error checking mood:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleDateSelect = (dateStr) => {
//     setSelectedDate(dateStr);
//   };

//   const handleMoodSelect = async (mood) => {
//     try {
//       await saveMood(mood, moodPeriod);
//       setShowMoodPopup(false);
//       console.log(`${moodPeriod} mood logged:`, mood);
//       // Later: navigate to journaling
//     } catch (error) {
//       console.error("Error saving mood:", error);
//       alert("Failed to save mood. Please try again.");
//     }
//   };

//   const handleCloseMoodPopup = () => {
//     setShowMoodPopup(false);
//   };

//   const selectedEntry = selectedDate ? dateEntries[selectedDate] : null;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {showMoodPopup && (
//         <MoodCheckPopup
//           onMoodSelect={handleMoodSelect}
//           onClose={handleCloseMoodPopup}
//         />
//       )}

//       <div className="min-h-screen bg-[#d6d0eb] p-6 flex gap-6">

//   {/* LEFT ICON BAR */}
//   <div className="flex flex-col items-center gap-6 pt-10">
//     {/* Profile Button */}
//     <div className="w-12 h-12 bg-white rounded-full shadow cursor-pointer hover:scale-110 transition" />

//     {/* Other icons */}
//     {[...Array(4)].map((_, i) => (
//       <div
//         key={i}
//         className="w-10 h-10 bg-white rounded-full cursor-pointer shadow hover:scale-110 transition"
//       />
//     ))}
//   </div>

//   {/* MAIN CENTER PANEL */}
//   <div className="flex-1 bg-white rounded-[30px] p-10 shadow-xl">
//     <div className="flex justify-between items-start mb-6">
//       <h1 className="text-3xl font-bold text-gray-800">
//         Welcome, {username || "User"}
//       </h1>

//       {/* Search bar */}
//       <div className="flex gap-2 items-center bg-gray-100 px-4 py-2 rounded-full shadow-sm">
//         <span className="text-gray-500">🔍</span>
//         <input
//           type="text"
//           placeholder="Search task, journal..."
//           className="bg-transparent outline-none text-sm w-48"
//         />
//       </div>
//     </div>

//     {/* Calendar and Date Details */}
//     <div className="flex gap-10">
//       {/* Smaller Calendar */}
//       <div className="scale-90 origin-top-left">
//         <Calendar onDateSelect={handleDateSelect} />
//       </div>

//       {/* Selected date details */}
//       <div className="flex-1 bg-gray-50 rounded-2xl p-6 shadow-inner">
//         {selectedDate ? (
//           <div>
//             <h2 className="text-xl font-semibold mb-3">
//               Your day: {selectedDate.toDateString()}
//             </h2>

//             <p className="text-gray-500">No entries yet. Mood, tasks, notes will show here.</p>
//           </div>
//         ) : (
//           <p className="text-gray-400 text-lg">Select a date to view your entries</p>
//         )}
//       </div>
//     </div>
//   </div>

//   {/* RIGHT SIDEBAR */}
//   <div className="w-64 flex flex-col gap-6 pt-10">
//     <div className="bg-white rounded-2xl p-5 h-36 shadow-lg" />
//     <div className="bg-white rounded-2xl p-5 h-36 shadow-lg" />
//     <div className="bg-white rounded-2xl p-5 h-36 shadow-lg" />
//   </div>

// </div>

//     </>
//   );
// };

// export default UserDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUsername } from "../services/auth";
import Calendar from "../components/Calendar";
import MoodCheckPopup from "../components/MoodCheckPopup";
import { shouldShowMoodCheck, saveMood } from "../services/moodCheckService";
import Sidebar from "../components/Sidebar";
import HabitsCard from "../components/HabitsCard";
import GoalsCard from "../components/GoalsCard";
import { Plus } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const username = getUsername();
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateEntries, setDateEntries] = useState({});
  
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [moodPeriod, setMoodPeriod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMoodStatus();
  }, []);

  const checkMoodStatus = async () => {
    try {
      const checkMood = await shouldShowMoodCheck();
      if (checkMood.show) {
        setShowMoodPopup(true);
        setMoodPeriod(checkMood.period);
      }
    } catch (error) {
      console.error("Error checking mood:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
  };

  const handleMoodSelect = async (moodData) => {
  try {
    await saveMood(moodData, moodPeriod);
    setShowMoodPopup(false);
    // console.log(`${moodPeriod} mood logged:`, mood);
    
    // Navigate to journal with mood data
    navigate('/journal', { 
      state: { 
        fromMoodCheck: true, 
        mood: moodData.value,
        period: moodPeriod 
      } 
    });
  } catch (error) {
    console.error("Error saving mood:", error);
    alert("Failed to save mood. Please try again.");
  }
};

  const handleCloseMoodPopup = () => {
    setShowMoodPopup(false);
  };

  const selectedEntry = selectedDate ? dateEntries[selectedDate] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {showMoodPopup && (
        <MoodCheckPopup
          onMoodSelect={handleMoodSelect}
          onClose={handleCloseMoodPopup}
        />
      )}

      <div className="min-h-screen bg-[#d6d0eb] p-6 flex gap-6">

        {/* LEFT SIDEBAR - Replace icon bar with Sidebar component */}
        <Sidebar />

        {/* MAIN CENTER PANEL */}
        <div className="flex-1 bg-white rounded-[50px] p-20 shadow-xl relative">          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {username || "User"}
            </h1>

            {/* Search bar */}
            {/* <div className="flex gap-20 items-left bg-gray-100 px-4 py-2 rounded-full shadow-sm">
              <span className="text-gray-500">🔍</span>
              <input
                type="text"
                placeholder="Search task, journal..."
                className="bg-transparent outline-none text-sm w-40"
              />
            </div> */}
          </div>

          {/* Calendar and Date Details */}
          <div className="flex gap-20">
            {/* Smaller Calendar */}
            <div className="scale-53 origin-top-left">
              <Calendar onDateSelect={handleDateSelect} />
            </div>

            {/* Selected date details */}
            {/* <div className="flex-20 bg-gray-20 rounded-2xl p-30 shadow-inner">
              {selectedDate ? (
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Your day: {selectedDate.toDateString()}
                  </h2>

                  <p className="text-gray-500">No entries yet. Mood, tasks, notes will show here.</p>
                </div>
              ) : (
                <p className="text-gray-400 text-lg">Select a date to view your entries</p>
              )}
            </div> */}
          </div>
          <button
  onClick={() => navigate('/journal')}
  className="absolute bottom-4 right-4 bg-purple-600 text-white p-5 rounded-full shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all flex items-center gap-2 group"
>
  <Plus className="w-6 h-6" />
  <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
    New Entry
  </span>
</button>


        </div>

        {/* RIGHT SIDEBAR - Replace placeholder divs with HabitsCard and GoalsCard */}
        <div className="w-80 flex flex-col gap-6 pt-10">
          <HabitsCard />
          <GoalsCard />
          {/* Optional: Keep third card as placeholder or add another component */}
          <div className="bg-white rounded-2xl p-5 h-36 shadow-lg" />
        </div>

      </div>
    </>
  );
};

export default UserDashboard;