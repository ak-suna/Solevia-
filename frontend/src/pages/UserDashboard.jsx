import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsername } from "../services/auth";
import Calendar from "../components/Calendar";
import MoodCheckPopup from "../components/MoodCheckPopup";
import { shouldShowMoodCheck, saveMood, getMoodHistory, getStreaks } from "../services/moodCheckService";
import Sidebar from "../components/Sidebar";
import HabitsCard from "../components/HabitsCard";
import GoalsCard from "../components/GoalsCard";
import { Bell, Menu, Flame, Plus } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const UserDashboard = () => {
  const navigate = useNavigate();
  const username = getUsername();
  const [selectedDate, setSelectedDate] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [moodPeriod, setMoodPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ADD THESE:
  const [moodStreak, setMoodStreak] = useState({ current: 0, best: 0 });
  const [habitStreak, setHabitStreak] = useState({ current: 0, best: 0 });

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
  <div className="bg-[#f8ba90] rounded-[40px] p-6 h-[180px] shadow-lg flex flex-col justify-between border-2 border-[#f4873e]/20">
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
    <div className="grid grid-cols-2 gap-4 mt-auto ">
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
            className="absolute bottom-2 right-4 bg-[#89beab] dark:bg-teal-600 text-white p-5 rounded-full shadow-lg hover:bg-[#FFA669] dark:hover:bg-teal-700 hover:shadow-xl transition-all flex items-center gap-2 group"
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