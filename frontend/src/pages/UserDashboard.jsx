// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { logout, getUsername } from "../services/auth";
// // import Calendar from "../components/Calendar";
// // import MoodCheckPopup from "../components/MoodCheckPopup";
// // import { shouldShowMoodCheck, saveMood } from "../services/moodCheckService";
// // import Sidebar from "../components/Sidebar";
// // import HabitsCard from "../components/HabitsCard";
// // import GoalsCard from "../components/GoalsCard";
// // import { Search, Bell, Menu, Flame, Plus} from 'lucide-react';
// // import { getMoodHistory } from "../services/moodCheckService";



// // const UserDashboard = () => {
// //   const navigate = useNavigate();
// //   const username = getUsername();
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [dateEntries, setDateEntries] = useState({});
// //   const [moodHistory, setMoodHistory] = useState([]);

  
// //   const [showMoodPopup, setShowMoodPopup] = useState(false);
// //   const [moodPeriod, setMoodPeriod] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     checkMoodStatus();
// //   }, []);

// //   const checkMoodStatus = async () => {
// //     try {
// //       const checkMood = await shouldShowMoodCheck();
// //       if (checkMood.show) {
// //         setShowMoodPopup(true);
// //         setMoodPeriod(checkMood.period);
// //       }
// //     } catch (error) {
// //       console.error("Error checking mood:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLogout = () => {
// //     logout();
// //     navigate("/login");
// //   };

// //   const handleDateSelect = (dateStr) => {
// //     setSelectedDate(dateStr);
// //   };

// //   const handleMoodSelect = async (moodData) => {
// //   try {
// //     await saveMood(moodData, moodPeriod);
// //     setShowMoodPopup(false);
// //     // console.log(`${moodPeriod} mood logged:`, mood);
    
// //     // Navigate to journal with mood data
// //     navigate('/journal', { 
// //       state: { 
// //         fromMoodCheck: true, 
// //         mood: moodData.value,
// //         period: moodPeriod 
// //       } 
// //     });
// //   } catch (error) {
// //     console.error("Error saving mood:", error);
// //     alert("Failed to save mood. Please try again.");
// //   }
// // };

// //   const handleCloseMoodPopup = () => {
// //     setShowMoodPopup(false);
// //   };
// //   const StreaksCard = () => (
// //   <div className="bg-white rounded-2xl p-5 h-36 shadow-lg flex flex-col justify-center items-center">
// //     <h2 className="font-bold text-lg">🔥 Streaks</h2>
// //     <p className="text-gray-500 text-sm">Keep up your streak!</p>
// //   </div>
// // );


// //   const selectedEntry = selectedDate ? dateEntries[selectedDate] : null;

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <p>Loading...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       {showMoodPopup && (
// //         <MoodCheckPopup
// //           onMoodSelect={handleMoodSelect}
// //           onClose={handleCloseMoodPopup}
// //         />
// //       )}

// //       <div className="min-h-screen bg-[#FCF8F5] p-6 flex gap-6 relative">

// //         {/* LEFT SIDEBAR - Replace icon bar with Sidebar component */}
// //         <Sidebar />

// //         {/* MAIN CENTER PANEL */}
// //         <div className="flex-1 ml-28 bg-[#EDE5DA] rounded-[50px] p-8 shadow-xl relative max-h-[775px] overflow-y-auto bg-[#FCF8F5]">          <div className="flex justify-between items-start mb-6">
// //             <h1 className="text-2xl font-bold text-gray-800">
// //               Welcome, {username || "User"}
// //             </h1>

          
// //           </div>
// // {/* Calendar and Date Details */}
// // <div className="flex gap-6 overflow-x-auto">
// //   {/* Calendar */}
// //   <div className="flex-shrink-0">
// //     <Calendar onDateSelect={handleDateSelect} />
// //   </div>

// //   {/* Selected date details */}
// //   <div className="flex-shrink-0 w-[480px] h-[600px] bg-[#FCF8F5] rounded-2xl p-6 shadow-inner">
// //     {selectedDate ? (
// //       <div>
// //         <h2 className="text-xl font-semibold mb-3">
// //           Your day: {selectedDate.toDateString()}
// //         </h2>
// //         <p className="text-gray-500">
// //           No entries yet. Mood, tasks, notes will show here.
// //         </p>
// //       </div>
// //     ) : (
// //       <p className="text-gray-400 text-lg">
// //         Select a date to view your entries
// //       </p>
// //     )}
// //   </div>
// // </div>

// //           <button
// //   onClick={() => navigate('/journal')}
// //   className="absolute bottom-2 right-4 bg-[#244856] text-white p-5 rounded-full shadow-lg hover:bg-[#366A7E] hover:shadow-xl transition-all flex items-center gap-2 group"
// // >
// //   <Plus className="w-6 h-6" />
// //   <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
// //     New Entry
// //   </span>
// // </button>


// //         </div>

// //         <div className="absolute top-6 right-6 flex items-center gap-6">
// //   <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg">
// //     <Bell className="w-7 h-7 text-gray-600" />
// //     <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
// //   </button>

// //   <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg">
// //     <Menu className="w-7 h-7 text-gray-600" />
// //   </button>
// // </div>


// //         {/* RIGHT SIDEBAR - Replace placeholder divs with HabitsCard and GoalsCard */}
// //         <div className="w-80 flex flex-col gap-5 pt-20">
// //   {/* Streaks at the top */}
// //   <StreaksCard />
// //   <HabitsCard />
// //   <GoalsCard />
// // </div>


// //       </div>
// //     </>
// //   );
// // };

// // export default UserDashboard;

// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { logout, getUsername } from "../services/auth";
// // import Calendar from "../components/Calendar";
// // import MoodCheckPopup from "../components/MoodCheckPopup";
// // import { shouldShowMoodCheck, saveMood, getMoodHistory } from "../services/moodCheckService";
// // import Sidebar from "../components/Sidebar";
// // import HabitsCard from "../components/HabitsCard";
// // import GoalsCard from "../components/GoalsCard";
// // import { Search, Bell, Menu, Flame, Plus} from 'lucide-react';

// // const UserDashboard = () => {
// //   const navigate = useNavigate();
// //   const username = getUsername();
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [dateEntries, setDateEntries] = useState({});
// //   const [moodHistory, setMoodHistory] = useState([]);
  
// //   const [showMoodPopup, setShowMoodPopup] = useState(false);
// //   const [moodPeriod, setMoodPeriod] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     checkMoodStatus();
// //     fetchMoodHistory();
// //   }, []);

// //   const fetchMoodHistory = async () => {
// //     try {
// //       const history = await getMoodHistory();
// //       setMoodHistory(history);
// //     } catch (error) {
// //       console.error("Error fetching mood history:", error);
// //     }
// //   };

// //   const checkMoodStatus = async () => {
// //     try {
// //       const checkMood = await shouldShowMoodCheck();
// //       if (checkMood.show) {
// //         setShowMoodPopup(true);
// //         setMoodPeriod(checkMood.period);
// //       }
// //     } catch (error) {
// //       console.error("Error checking mood:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLogout = () => {
// //     logout();
// //     navigate("/login");
// //   };

// //   const handleDateSelect = (dateStr) => {
// //     setSelectedDate(dateStr);
// //   };

// //   const handleMoodSelect = async (moodData) => {
// //     try {
// //       await saveMood(moodData, moodPeriod);
// //       setShowMoodPopup(false);
      
// //       // Refresh mood history after saving
// //       await fetchMoodHistory();
      
// //       // Navigate to journal with mood data
// //       navigate('/journal', { 
// //         state: { 
// //           fromMoodCheck: true, 
// //           mood: moodData.value,
// //           period: moodPeriod 
// //         } 
// //       });
// //     } catch (error) {
// //       console.error("Error saving mood:", error);
// //       alert("Failed to save mood. Please try again.");
// //     }
// //   };

// //   const handleCloseMoodPopup = () => {
// //     setShowMoodPopup(false);
// //   };

// //   const StreaksCard = () => (
// //     <div className="bg-white rounded-2xl p-5 h-36 shadow-lg flex flex-col justify-center items-center">
// //       <h2 className="font-bold text-lg">🔥 Streaks</h2>
// //       <p className="text-gray-500 text-sm">Keep up your streak!</p>
// //     </div>
// //   );

// //   // Get mood data for selected date
// //   const getSelectedDateMood = () => {
// //     if (!selectedDate || !moodHistory.length) return null;
    
// //     const dateStr = selectedDate.toISOString().split('T')[0];
// //     return moodHistory.find(entry => 
// //       new Date(entry.date).toISOString().split('T')[0] === dateStr
// //     );
// //   };

// //   const selectedDateMood = getSelectedDateMood();

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <p>Loading...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       {showMoodPopup && (
// //         <MoodCheckPopup
// //           onMoodSelect={handleMoodSelect}
// //           onClose={handleCloseMoodPopup}
// //         />
// //       )}

// // <div className="min-h-screen bg-gradient-to-br from-[#f1bdcd] via-[#f5d9c9] to-[#A7D5C4]">
// //         {/* LEFT SIDEBAR */}
// //         <Sidebar />

// //         {/* MAIN CENTER PANEL */}
// //         <div className="flex-1 ml-28 bg-[#EDE5DA] rounded-[50px] p-8 shadow-xl relative max-h-[775px] overflow-y-auto bg-[#FCF8F5]">
// //           <div className="flex justify-between items-start mb-6">
// //             <h1 className="text-2xl font-bold text-gray-800">
// //               Welcome, {username || "User"}
// //             </h1>
// //           </div>

// //           {/* Calendar and Date Details */}
// //           <div className="flex gap-6 overflow-x-auto">
// //             {/* Calendar */}
// //             <div className="flex-shrink-0">
// //               <Calendar onDateSelect={handleDateSelect} moodData={moodHistory} />
// //             </div>

// //             {/* Selected date details */}
// //             <div className="flex-shrink-0 w-[480px] h-[600px] bg-[#ffffff] rounded-2xl p-6 shadow-inner overflow-y-auto">
// //               {selectedDate ? (
// //                 <div>
// //                   <h2 className="text-xl font-semibold mb-4">
// //                     {selectedDate.toDateString()}
// //                   </h2>
                  
// //                   {/* Mood Section */}
// //                   {selectedDateMood ? (
// //                     <div className="mb-6">
// //                       <h3 className="text-lg font-semibold mb-3 text-gray-700">Mood</h3>
// //                       <div className="space-y-3">
// //                         {selectedDateMood.morning && (
// //   <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
// //     <img 
// //       src={selectedDateMood.morning.emoji}
// //       alt={selectedDateMood.morning.label}
// //       className="w-10 h-10 rounded-full"
// //     />
// //     <div>
// //       <p className="font-medium text-gray-800">Morning</p>
// //       <p className="text-sm text-gray-600">{selectedDateMood.morning.label}</p>
// //     </div>
// //   </div>
// // )}

// // {selectedDateMood.evening && (
// //   <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
// //     <img 
// //       src={selectedDateMood.evening.emoji}
// //       alt={selectedDateMood.evening.label}
// //       className="w-10 h-10 rounded-full"
// //     />
// //     <div>
// //       <p className="font-medium text-gray-800">Evening</p>
// //       <p className="text-sm text-gray-600">{selectedDateMood.evening.label}</p>
// //     </div>
// //   </div>
// // )}
                        
// //                         {!selectedDateMood.morning && !selectedDateMood.evening && (
// //                           <p className="text-gray-500 text-sm">No mood logged for this day</p>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="mb-6">
// //                       <h3 className="text-lg font-semibold mb-3 text-gray-700">Mood</h3>
// //                       <p className="text-gray-500 text-sm">No mood logged for this day</p>
// //                     </div>
// //                   )}
                  
// //                   {/* Other entries placeholder */}
// //                   <div className="mt-6">
// //                     <h3 className="text-lg font-semibold mb-3 text-gray-700">Notes & Tasks</h3>
// //                     <p className="text-gray-500 text-sm">No entries yet.</p>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <p className="text-gray-400 text-lg">
// //                   Select a date to view your entries
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           <button
// //             onClick={() => navigate('/journal')}
// //             className="absolute bottom-2 right-4 bg-[#244856] text-white p-5 rounded-full shadow-lg hover:bg-[#366A7E] hover:shadow-xl transition-all flex items-center gap-2 group"
// //           >
// //             <Plus className="w-6 h-6" />
// //             <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
// //               New Entry
// //             </span>
// //           </button>
// //         </div>

// //         <div className="absolute top-6 right-6 flex items-center gap-6">
// //           <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg">
// //             <Bell className="w-7 h-7 text-gray-600" />
// //             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
// //           </button>

// //           <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg">
// //             <Menu className="w-7 h-7 text-gray-600" />
// //           </button>
// //         </div>

// //         {/* RIGHT SIDEBAR */}
// //         <div className="w-80 flex flex-col gap-5 pt-20">
// //           <StreaksCard />
// //           <HabitsCard />
// //           <GoalsCard />
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default UserDashboard;


// //this one formatting wrong right logic
// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { logout, getUsername } from "../services/auth";
// // import Calendar from "../components/Calendar";
// // import MoodCheckPopup from "../components/MoodCheckPopup";
// // import { shouldShowMoodCheck, saveMood, getMoodHistory } from "../services/moodCheckService";
// // import Sidebar from "../components/Sidebar";
// // import HabitsCard from "../components/HabitsCard";
// // import GoalsCard from "../components/GoalsCard";
// // import { Search, Bell, Menu, Flame, Plus} from 'lucide-react';

// // const UserDashboard = () => {
// //   const navigate = useNavigate();
// //   const username = getUsername();
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [dateEntries, setDateEntries] = useState({});
// //   const [moodHistory, setMoodHistory] = useState([]);
  
// //   const [showMoodPopup, setShowMoodPopup] = useState(false);
// //   const [moodPeriod, setMoodPeriod] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     checkMoodStatus();
// //     fetchMoodHistory();
// //   }, []);

// //   const fetchMoodHistory = async () => {
// //     try {
// //       const history = await getMoodHistory();
// //       setMoodHistory(history);
// //     } catch (error) {
// //       console.error("Error fetching mood history:", error);
// //     }
// //   };

// //   const checkMoodStatus = async () => {
// //     try {
// //       const checkMood = await shouldShowMoodCheck();
// //       if (checkMood.show) {
// //         setShowMoodPopup(true);
// //         setMoodPeriod(checkMood.period);
// //       }
// //     } catch (error) {
// //       console.error("Error checking mood:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLogout = () => {
// //     logout();
// //     navigate("/login");
// //   };

// //   const handleDateSelect = (dateStr) => {
// //     setSelectedDate(dateStr);
// //   };

// //   const handleMoodSelect = async (moodData) => {
// //     try {
// //       await saveMood(moodData, moodPeriod);
// //       setShowMoodPopup(false);
      
// //       await fetchMoodHistory();
      
// //       navigate('/journal', { 
// //         state: { 
// //           fromMoodCheck: true, 
// //           mood: moodData.value,
// //           period: moodPeriod 
// //         } 
// //       });
// //     } catch (error) {
// //       console.error("Error saving mood:", error);
// //       alert("Failed to save mood. Please try again.");
// //     }
// //   };

// //   const handleCloseMoodPopup = () => {
// //     setShowMoodPopup(false);
// //   };

// //   const StreaksCard = () => (
// //     <div className="bg-white rounded-2xl p-5 h-36 shadow-lg flex flex-col justify-center items-center">
// //       <h2 className="font-bold text-lg">🔥 Streaks</h2>
// //       <p className="text-gray-500 text-sm">Keep up your streak!</p>
// //     </div>
// //   );

// //   const getSelectedDateMood = () => {
// //     if (!selectedDate || !moodHistory.length) return null;
    
// //     const dateStr = selectedDate.toISOString().split('T')[0];
// //     return moodHistory.find(entry => 
// //       new Date(entry.date).toISOString().split('T')[0] === dateStr
// //     );
// //   };

// //   const selectedDateMood = getSelectedDateMood();

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <p>Loading...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       {showMoodPopup && (
// //         <MoodCheckPopup
// //           onMoodSelect={handleMoodSelect}
// //           onClose={handleCloseMoodPopup}
// //         />
// //       )}

// //       {/* FIXED MAIN CONTAINER */}
// //       <div className="min-h-screen bg-gradient-to-br from-[#f1bdcd] via-[#f5d9c9] to-[#A7D5C4] p-6">
// //         {/* FLEX CONTAINER FOR ALL SECTIONS */}
// //         <div className="flex gap-6">
// //           {/* LEFT SIDEBAR */}
// //           <Sidebar />

// //           {/* CENTER PANEL - Fixed width to prevent stretching */}
// //           <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
// //             <div className="bg-[#FCF8F5] rounded-[50px] p-8 shadow-xl h-[calc(100vh-48px)] overflow-y-auto relative">
// //               {/* HEADER */}
// //               <div className="flex justify-between items-center mb-8">
// //                 <h1 className="text-2xl font-bold text-gray-800">
// //                   Welcome, {username || "User"}
// //                 </h1>
                
// //                 {/* NOTIFICATION & MENU BUTTONS - Moved from absolute positioning */}
// //                 <div className="flex items-center gap-4">
// //                   <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg">
// //                     <Bell className="w-7 h-7 text-gray-600" />
// //                     <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
// //                   </button>
// //                   <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg">
// //                     <Menu className="w-7 h-7 text-gray-600" />
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* CALENDAR AND DATE DETAILS */}
// //               <div className="flex gap-6">
// //                 {/* CALENDAR */}
// //                 <div className="flex-shrink-0">
// //                   <Calendar onDateSelect={handleDateSelect} moodData={moodHistory} />
// //                 </div>

// //                 {/* DATE DETAILS CARD */}
// //                 <div className="flex-shrink-0 w-[480px] h-[600px] bg-white rounded-2xl p-6 shadow-inner overflow-y-auto">
// //                   {selectedDate ? (
// //                     <div>
// //                       <h2 className="text-xl font-semibold mb-4">
// //                         {selectedDate.toDateString()}
// //                       </h2>
                      
// //                       {/* MOOD SECTION */}
// //                       {selectedDateMood ? (
// //                         <div className="mb-6">
// //                           <h3 className="text-lg font-semibold mb-3 text-gray-700">Mood</h3>
// //                           <div className="space-y-3">
// //                             {selectedDateMood.morning && (
// //                               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// //                                 <img 
// //                                   src={selectedDateMood.morning.emoji}
// //                                   alt={selectedDateMood.morning.label}
// //                                   className="w-10 h-10 rounded-full"
// //                                 />
// //                                 <div>
// //                                   <p className="font-medium text-gray-800">Morning</p>
// //                                   <p className="text-sm text-gray-600">{selectedDateMood.morning.label}</p>
// //                                 </div>
// //                               </div>
// //                             )}
                            
// //                             {selectedDateMood.evening && (
// //                               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// //                                 <img 
// //                                   src={selectedDateMood.evening.emoji}
// //                                   alt={selectedDateMood.evening.label}
// //                                   className="w-10 h-10 rounded-full"
// //                                 />
// //                                 <div>
// //                                   <p className="font-medium text-gray-800">Evening</p>
// //                                   <p className="text-sm text-gray-600">{selectedDateMood.evening.label}</p>
// //                                 </div>
// //                               </div>
// //                             )}
// //                           </div>
// //                         </div>
// //                       ) : (
// //                         <div className="mb-6">
// //                           <h3 className="text-lg font-semibold mb-3 text-gray-700">Mood</h3>
// //                           <p className="text-gray-500 text-sm">No mood logged for this day</p>
// //                         </div>
// //                       )}
                      
// //                       {/* OTHER ENTRIES */}
// //                       <div className="mt-6">
// //                         <h3 className="text-lg font-semibold mb-3 text-gray-700">Notes & Tasks</h3>
// //                         <p className="text-gray-500 text-sm">No entries yet.</p>
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="h-full flex items-center justify-center">
// //                       <p className="text-gray-400 text-lg text-center">
// //                         Select a date to view your entries
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* NEW ENTRY BUTTON */}
// //               <button
// //                 onClick={() => navigate('/journal')}
// //                 className="absolute bottom-6 right-6 bg-[#244856] text-white p-4 rounded-full shadow-lg hover:bg-[#366A7E] hover:shadow-xl transition-all flex items-center gap-2 group"
// //               >
// //                 <Plus className="w-6 h-6" />
// //                 <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
// //                   New Entry
// //                 </span>
// //               </button>
// //             </div>
// //           </div>

// //           {/* RIGHT SIDEBAR - Fixed width and positioning */}
// //           <div className="w-80 flex flex-col gap-5">
// //             <StreaksCard />
// //             <HabitsCard />
// //             <GoalsCard />
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default UserDashboard;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout, getUsername } from "../services/auth";
// import Calendar from "../components/Calendar";
// import MoodCheckPopup from "../components/MoodCheckPopup";
// import { shouldShowMoodCheck, saveMood, getMoodHistory } from "../services/moodCheckService";
// import Sidebar from "../components/Sidebar";
// import HabitsCard from "../components/HabitsCard";
// import GoalsCard from "../components/GoalsCard";
// import { Search, Bell, Menu, Flame, Plus} from 'lucide-react';

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const username = getUsername();
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [dateEntries, setDateEntries] = useState({});
//   const [moodHistory, setMoodHistory] = useState([]);
  
//   const [showMoodPopup, setShowMoodPopup] = useState(false);
//   const [moodPeriod, setMoodPeriod] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkMoodStatus();
//     fetchMoodHistory();
//   }, []);

//   const fetchMoodHistory = async () => {
//     try {
//       const history = await getMoodHistory();
//       setMoodHistory(history);
//     } catch (error) {
//       console.error("Error fetching mood history:", error);
//     }
//   };

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

//   const handleMoodSelect = async (moodData) => {
//     try {
//       await saveMood(moodData, moodPeriod);
//       setShowMoodPopup(false);
      
//       await fetchMoodHistory();
      
//       navigate('/journal', { 
//         state: { 
//           fromMoodCheck: true, 
//           mood: moodData.value,
//           period: moodPeriod 
//         } 
//       });
//     } catch (error) {
//       console.error("Error saving mood:", error);
//       alert("Failed to save mood. Please try again.");
//     }
//   };

//   const handleCloseMoodPopup = () => {
//     setShowMoodPopup(false);
//   };

//   const StreaksCard = () => (
//     <div className="bg-white rounded-2xl p-5 h-36 shadow-lg flex flex-col justify-center items-center">
//       <h2 className="font-bold text-lg">🔥 Streaks</h2>
//       <p className="text-gray-500 text-sm">Keep up your streak!</p>
//     </div>
//   );

//   const getSelectedDateMood = () => {
//     if (!selectedDate || !moodHistory.length) return null;
    
//     const dateStr = selectedDate.toISOString().split('T')[0];
//     return moodHistory.find(entry => 
//       new Date(entry.date).toISOString().split('T')[0] === dateStr
//     );
//   };

//   const selectedDateMood = getSelectedDateMood();

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

//       <div className="min-h-screen bg-white

//  p-6 flex gap-6 relative">
//         {/* LEFT SIDEBAR */}
//         <Sidebar />

//         {/* MAIN CENTER PANEL - Using the commented layout's structure */}
// <div className="flex-1 ml-28 border-2  bg-white rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] relative max-h-[775px] overflow-y-auto">
//           <div className="flex justify-between items-start mb-6"
//           style={{ fontFamily: "Brasika" }}>
//             <h1 className="text-3xl font-bold text-gray-800">
//   <span className="text-[#f4873e]">Welcome, </span>
//   <span className="text-green-900">{username || "User"}</span>
// </h1>

//           </div>

//           {/* Calendar and Date Details */}
//           <div className="flex gap-6 overflow-x-auto">
//             {/* Calendar */}
//             <div className="flex-shrink-0">
//               <Calendar onDateSelect={handleDateSelect} moodData={moodHistory} />
//             </div>

//             {/* Selected date details - Updated with mood data logic */}
//             <div className="flex-shrink-0 w-[480px] h-[600px] bg-[#f4f2f0] rounded-2xl p-6 shadow-inner overflow-y-auto">
//               {selectedDate ? (
//                 <div>
//                   <h2 className="text-xl font-semibold mb-4">
//                     {selectedDate.toDateString()}
//                   </h2>
                  
//                   {/* Mood Section */}
//                   {selectedDateMood ? (
//                     <div className="mb-6">
//                       <h3 className="text-lg font-semibold mb-3 text-gray-700">Mood</h3>
//                       <div className="space-y-3">
//                         {selectedDateMood.morning && (
//                           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                             <img 
//                               src={selectedDateMood.morning.emoji}
//                               alt={selectedDateMood.morning.label}
//                               className="w-10 h-10 rounded-full"
//                             />
//                             <div>
//                               <p className="font-medium text-gray-800">Morning</p>
//                               <p className="text-sm text-gray-600">{selectedDateMood.morning.label}</p>
//                             </div>
//                           </div>
//                         )}
                        
//                         {selectedDateMood.evening && (
//                           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                             <img 
//                               src={selectedDateMood.evening.emoji}
//                               alt={selectedDateMood.evening.label}
//                               className="w-10 h-10 rounded-full"
//                             />
//                             <div>
//                               <p className="font-medium text-gray-800">Evening</p>
//                               <p className="text-sm text-gray-600">{selectedDateMood.evening.label}</p>
//                             </div>
//                           </div>
//                         )}
                        
//                         {!selectedDateMood.morning && !selectedDateMood.evening && (
//                           <p className="text-gray-500 text-sm">No mood logged for this day</p>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="mb-6">
//                       <h3 className="text-lg font-semibold mb-3 text-gray-700">Mood</h3>
//                       <p className="text-gray-500 text-sm">No mood logged for this day</p>
//                     </div>
//                   )}
                  
//                   {/* Other entries placeholder */}
//                   <div className="mt-6">
//                     <h3 className="text-lg font-semibold mb-3 text-gray-700">Notes & Tasks</h3>
//                     <p className="text-gray-500 text-sm">No entries yet.</p>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-lg">
//                   Select a date to view your entries
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* New Entry Button - Using commented layout's positioning */}
//           <button
//             onClick={() => navigate('/journal')}
//             className="absolute bottom-2 right-4 bg-[#89beab] text-white p-5 rounded-full shadow-lg hover:bg-[#89beab] hover:shadow-xl transition-all flex items-center gap-2 group"
//           >
//             <Plus className="w-6 h-6" />
//             <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
//               New Entry
//             </span>
//           </button>
//         </div>

//         {/* Top Right Navigation Buttons - Using commented layout's absolute positioning */}
//         <div className="absolute top-6 right-6 flex items-center gap-6">
//           <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg">
//             <Bell className="w-7 h-7 text-gray-600" />
//             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
//           </button>

//           <button 
//   onClick={() => navigate('/settings')}
//   className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg"
// >
//   <Menu className="w-7 h-7 text-gray-600" />
// </button>
//         </div>

//         {/* RIGHT SIDEBAR - Using commented layout's spacing */}
//         <div className="w-80 flex flex-col gap-5 pt-20">
//           <StreaksCard />
//           <HabitsCard />
//           <GoalsCard />
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUsername } from "../services/auth";
import Calendar from "../components/Calendar";
import MoodCheckPopup from "../components/MoodCheckPopup";
import { shouldShowMoodCheck, saveMood, getMoodHistory, getStreaks } from "../services/moodCheckService";
import Sidebar from "../components/Sidebar";
import HabitsCard from "../components/HabitsCard";
import GoalsCard from "../components/GoalsCard";
import { Search, Bell, Menu, Flame, Plus} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const UserDashboard = () => {
  const navigate = useNavigate();
  const username = getUsername();
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateEntries, setDateEntries] = useState({});
  const [moodHistory, setMoodHistory] = useState([]);
  
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [moodPeriod, setMoodPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ADD THESE:
  const [moodStreak, setMoodStreak] = useState({ current: 0, best: 0 });
  const [habitStreak, setHabitStreak] = useState({ current: 0, best: 0 });

  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', completedToday: true },
    { id: 2, name: 'Drink 8 glasses of water', completedToday: true },
    { id: 3, name: 'Evening walk', completedToday: false },
  ]);

  const [goals, setGoals] = useState([
    { id: 1, name: 'Read 12 books this year', progress: 65, status: 'active' },
    { id: 2, name: 'Exercise 4x per week', progress: 80, status: 'active' },
  ]);

  useEffect(() => {
    checkMoodStatus();
    fetchMoodHistory();
    fetchStreaks(); // ADD THIS
  }, []);

  // ADD THIS FUNCTION:
  const fetchStreaks = async () => {
    try {
      const streaks = await getStreaks();
      setMoodStreak(streaks.moodStreak);
      setHabitStreak(streaks.habitStreak);
    } catch (error) {
      console.error("Error fetching streaks:", error);
    }
  };

  const fetchMoodHistory = async () => {
    try {
      const history = await getMoodHistory();
      setMoodHistory(history);
    } catch (error) {
      console.error("Error fetching mood history:", error);
    }
  };

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

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
  };

  const handleMoodSelect = async (moodData) => {
    try {
      const result = await saveMood(moodData, moodPeriod);
      setShowMoodPopup(false);
      
      // Update streak from response
      if (result.moodStreak) {
        setMoodStreak(result.moodStreak);
      }
      
      await fetchMoodHistory();
      await fetchStreaks(); // Refresh streaks
      
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

  // REPLACE THIS COMPONENT:
const StreaksCard = () => (
  <div className="bg-[#f8ba90] rounded-[40px] p-6 h-[200px] shadow-lg flex flex-col justify-between border-2 border-[#f4873e]/20">
    {/* Main Streak - Mood */}
    <div className="mb-3">
      <h3 className="text-[#1F3B36] text-sm uppercase tracking-wide font-bold">Check-in Streak</h3>
      <div className="flex items-center justify-center mt-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#f4873e] to-[#ff9e5e] rounded-full flex items-center justify-center shadow-md">
            <Flame className="w-5 h-5 text-white" fill="#f4873e" />
          </div>
          <div className="flex items-center">
            <span className="text-4xl font-bold text-white">{moodStreak.current}</span>
            <span className="text-lg font-bold text-white/80 ml-2">days</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Stats Row */}
    <div className="grid grid-cols-2 gap-4 mt-auto">
      <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm border border-[#f4873e]/10">
        <p className="text-[#2d6b57] text-xs mb-1">Best Streak</p>
        <p className="text-xl font-bold text-[#8b5a2b]">{moodStreak.best}</p>
      </div>
      <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm border border-[#f4873e]/10">
        <p className="text-[#2d6b57] text-xs mb-1">Habit Streak</p>
        <p className="text-xl font-bold text-[#2d6b57]">{habitStreak.current}</p>
      </div>
    </div>
  </div>
);

  const getSelectedDateMood = () => {
    if (!selectedDate || !moodHistory.length) return null;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    return moodHistory.find(entry => 
      new Date(entry.date).toISOString().split('T')[0] === dateStr
    );
  };

  const selectedDateMood = getSelectedDateMood();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">Loading...</p>
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

      <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex gap-6 relative">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* MAIN CENTER PANEL */}
        <div className="flex-1 ml-28 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[50px] p-8 shadow-[0_10px_25px_rgba(248,186,144,0.25)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative max-h-[775px] overflow-y-auto">
          <div className="flex justify-between items-start mb-6"
          style={{ fontFamily: "Brasika" }}>
            <h1 className="text-3xl font-bold">
              <span className="text-[#f4873e] dark:text-orange-400">Welcome, </span>
              <span className="text-green-900 dark:text-green-400">{username || "User"}</span>
            </h1>
          </div>

          {/* Calendar and Date Details */}
          <div className="flex gap-6 overflow-x-auto">
            {/* Calendar */}
            <div className="flex-shrink-0">
              <Calendar onDateSelect={handleDateSelect} moodData={moodHistory} />
            </div>

            {/* Selected date details */}
            <div className="flex-shrink-0 w-[480px] h-[600px] bg-[#f4f2f0] dark:bg-gray-700 rounded-2xl p-6 shadow-inner overflow-y-auto">
              {selectedDate ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {selectedDate.toDateString()}
                  </h2>
                  
                  {/* Mood Section */}
                  {selectedDateMood ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Mood</h3>
                      <div className="space-y-3">
                        {selectedDateMood.morning && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                            <img 
                              src={selectedDateMood.morning.emoji}
                              alt={selectedDateMood.morning.label}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-100">Morning</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedDateMood.morning.label}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedDateMood.evening && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                            <img 
                              src={selectedDateMood.evening.emoji}
                              alt={selectedDateMood.evening.label}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-100">Evening</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedDateMood.evening.label}</p>
                            </div>
                          </div>
                        )}
                        
                        {!selectedDateMood.morning && !selectedDateMood.evening && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No mood logged for this day</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Mood</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No mood logged for this day</p>
                    </div>
                  )}
                  
                  {/* Other entries placeholder */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Notes & Tasks</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No entries yet.</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-lg">
                  Select a date to view your entries
                </p>
              )}
            </div>
          </div>

          {/* New Entry Button */}
          <button
            onClick={() => navigate('/journal')}
            className="absolute bottom-2 right-4 bg-[#89beab] dark:bg-teal-600 text-white p-5 rounded-full shadow-lg hover:bg-[#89beab] dark:hover:bg-teal-700 hover:shadow-xl transition-all flex items-center gap-2 group"
          >
            <Plus className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
              New Entry
            </span>
          </button>
        </div>

        {/* Top Right Navigation Buttons */}
        <div className="absolute top-6 right-6 flex items-center gap-6">
          <NotificationBell />

          <button 
            onClick={() => navigate('/settings')}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
          >
            <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-80 flex flex-col gap-5 pt-20">
          <StreaksCard />
          <HabitsCard />
          <GoalsCard/>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;