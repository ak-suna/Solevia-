import React, { useState } from "react";
import { X } from "lucide-react";

const MoodCheckPopup = ({ onMoodSelect, onClose }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  // Using PNG images instead of text emojis
  const moods = [
    { 
      emoji: "/emojis/happy.png",      // Path to PNG
      label: "Happy", 
      value: "happy", 
      color: "#4ade80" 
    },
    { 
      emoji: "/emojis/sad.png",        // Path to PNG
      label: "Sad", 
      value: "sad", 
      color: "#f87171" 
    },
    { 
      emoji: "/emojis/excited.png",    // Path to PNG
      label: "Excited", 
      value: "excited", 
      color: "#60a5fa" 
    },
    { 
      emoji: "/emojis/neutral.png",    // Path to PNG
      label: "Neutral", 
      value: "neutral", 
      color: "#fbbf24" 
    },
    { 
      emoji: "/emojis/tired.png",      // Path to PNG
      label: "Tired", 
      value: "tired", 
      color: "#94a3b8" 
    },
    { 
      emoji: "/emojis/anxious.png",    // Path to PNG
      label: "Anxious", 
      value: "anxious", 
      color: "#a78bfa" 
    },
    { 
      emoji: "/emojis/angry.png",      // Path to PNG
      label: "Angry", 
      value: "angry", 
      color: "#f97316" 
    },
  ];

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood);
    }
  };

  const getTimePeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    return "Evening";
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-700 rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl relative border border-gray-100 dark:border-gray-600">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Good {getTimePeriod()}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">How are you feeling right now?</p>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-8">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodClick(mood)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all hover:scale-105 ${
                selectedMood?.value === mood.value
                  ? "ring-4 ring-[#3e7e97] bg-teal-50 dark:bg-teal-900/30"
                  : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {/* PNG image instead of text emoji */}
              <img 
                src={mood.emoji} 
                alt={mood.label}
                className="w-20 h-20 mb-2 object-contain"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedMood}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            selectedMood
              ? "bg-[#1a343e] text-white hover:bg-[#e26a00] dark:bg-teal-600 dark:hover:bg-teal-500"
              : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          Save 
        </button>
      </div>
    </div>
  );
};

export default MoodCheckPopup;