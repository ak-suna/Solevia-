// const API_BASE_URL = "http://localhost:5000/api"; // Change to your backend URL

// // Check if user needs to log mood
// export const shouldShowMoodCheck = async () => {
//   try {
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       return { show: false, period: null };
//     }
    
//     // Check backend for today's moods
//     const response = await fetch(`${API_BASE_URL}/mood/today`, {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error("Failed to fetch mood status");
//     }
    
//     const data = await response.json();
//     const currentHour = new Date().getHours();
    
//     // Morning check: 5 AM - 12 PM
//     if (currentHour >= 5 && currentHour < 12 && !data.morning) {
//       return { show: true, period: "morning" };
//     }
    
//     // Evening check: 5 PM - 11 PM
//     if (currentHour >= 17 && currentHour < 23 && !data.evening) {
//       return { show: true, period: "evening" };
//     }
    
//     return { show: false, period: null };
    
//   } catch (error) {
//     console.error("Error checking mood status:", error);
//     return { show: false, period: null };
//   }
// };

// // Save mood to backend
// export const saveMood = async (mood, period) => {
//   try {
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       throw new Error("No authentication token");
//     }
    
//     const response = await fetch(`${API_BASE_URL}/mood`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         mood: mood.value,
//         emoji: mood.emoji,
//         label: mood.label,
//         color: mood.color,
//         period: period
//       })
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to save mood");
//     }
    
//     const data = await response.json();
//     return data;
    
//   } catch (error) {
//     console.error("Error saving mood:", error);
//     throw error;
//   }
// };

// // Get mood history for calendar
// export const getMoodHistory = async (startDate, endDate) => {
//   try {
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       throw new Error("No authentication token");
//     }
    
//     const params = new URLSearchParams();
//     if (startDate) params.append("startDate", startDate);
//     if (endDate) params.append("endDate", endDate);
    
//     const response = await fetch(`${API_BASE_URL}/mood/history?${params}`, {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error("Failed to fetch mood history");
//     }
    
//     const data = await response.json();
//     return data;
    
//   } catch (error) {
//     console.error("Error fetching mood history:", error);
//     return [];
//   }
// };

// const API_BASE_URL = "http://localhost:5000/api"; // Matches your auth service

// // Check if user needs to log mood
// export const shouldShowMoodCheck = async () => {
//   // TEMPORARY: Always show popup for testing
//   console.log("🔍 Checking if mood popup should show...");
  
//   try {
//     const token = localStorage.getItem("token");
//     console.log("Token exists:", !!token);
    
//     if (!token) {
//       console.log("❌ No token found");
//       return { show: false, period: null };
//     }
    
//     // Check backend for today's moods
//     const response = await fetch(`${API_BASE_URL}/mood/today`, {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });
    
//     console.log("Backend response status:", response.status);
    
//     if (!response.ok) {
//       console.error("❌ Failed to fetch mood status");
//       throw new Error("Failed to fetch mood status");
//     }
    
//     const data = await response.json();
//     console.log("Today's moods:", data);
    
//     const currentHour = new Date().getHours();
//     console.log("Current hour:", currentHour);
    
//     // TEMPORARY: Force show for testing (remove this later)
//     console.log("✅ Forcing popup to show for testing");
//     return { show: true, period: "morning" };
    
//     /* ORIGINAL CODE - uncomment this after testing:
//     // Morning check: 5 AM - 12 PM
//     if (currentHour >= 5 && currentHour < 12 && !data.morning) {
//       console.log("✅ Should show morning mood popup");
//       return { show: true, period: "morning" };
//     }
    
//     // Evening check: 5 PM - 11 PM
//     if (currentHour >= 17 && currentHour < 23 && !data.evening) {
//       console.log("✅ Should show evening mood popup");
//       return { show: true, period: "evening" };
//     }
    
//     console.log("❌ No mood popup needed");
//     return { show: false, period: null };
//     */
    
//   } catch (error) {
//     console.error("Error checking mood status:", error);
//     return { show: false, period: null };
//   }
// };

// // Save mood to backend
// export const saveMood = async (mood, period) => {
//   try {
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       throw new Error("No authentication token");
//     }
    
//     const response = await fetch(`${API_BASE_URL}/mood`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         mood: mood.value,
//         emoji: mood.emoji,
//         label: mood.label,
//         color: mood.color,
//         period: period
//       })
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to save mood");
//     }
    
//     const data = await response.json();
//     return data;
    
//   } catch (error) {
//     console.error("Error saving mood:", error);
//     throw error;
//   }
// };

// // Get mood history for calendar
// export const getMoodHistory = async (startDate, endDate) => {
//   try {
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       throw new Error("No authentication token");
//     }
    
//     const params = new URLSearchParams();
//     if (startDate) params.append("startDate", startDate);
//     if (endDate) params.append("endDate", endDate);
    
//     const response = await fetch(`${API_BASE_URL}/mood/history?${params}`, {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error("Failed to fetch mood history");
//     }
    
//     const data = await response.json();
//     return data;
    
//   } catch (error) {
//     console.error("Error fetching mood history:", error);
//     return [];
//   }
// };

const API_BASE_URL = "http://localhost:5000/api"; // Matches your auth service

// Check if user needs to log mood
export const shouldShowMoodCheck = async () => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { show: false, period: null };
    }
    
    // Check backend for today's moods
    const response = await fetch(`${API_BASE_URL}/mood/today`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch mood status");
    }
    
    const data = await response.json();
    const currentHour = new Date().getHours();
    
    // Morning check: 5 AM - 12 PM
    if (currentHour >= 5 && currentHour < 12 && !data.morning) {
      return { show: true, period: "morning" };
    }
    
    // Evening check: 5 PM - 11 PM
    if (currentHour >= 17 && currentHour < 23 && !data.evening) {
      return { show: true, period: "evening" };
    }
    
    return { show: false, period: null };
    
  } catch (error) {
    console.error("Error checking mood status:", error);
    return { show: false, period: null };
  }
};

// Save mood to backend
export const saveMood = async (mood, period) => {
  console.log("💾 Attempting to save mood:", { mood, period });
  
  try {
    const token = localStorage.getItem("token");
    console.log("Token exists:", !!token);
    
    if (!token) {
      throw new Error("No authentication token");
    }
    
    const payload = {
      mood: mood.value,
      emoji: mood.emoji,
      label: mood.label,
      color: mood.color,
      period: period
    };
    
    console.log("Sending payload:", payload);
    console.log("To URL:", `${API_BASE_URL}/mood`);
    
    const response = await fetch(`${API_BASE_URL}/mood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Response status:", response.status);
    
    const data = await response.json();
    console.log("Response data:", data);
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to save mood");
    }
    
    console.log("✅ Mood saved successfully!");
    return data;
    
  } catch (error) {
    console.error("❌ Error saving mood:", error);
    console.error("Error details:", error.message);
    throw error;
  }
};

// Get mood history for calendar
export const getMoodHistory = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token");
    }
    
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    
    const response = await fetch(`${API_BASE_URL}/mood/history?${params}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch mood history");
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Error fetching mood history:", error);
    return [];
  }
};
export const getStreaks = async () => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return { moodStreak: { current: 0, best: 0 }, habitStreak: { current: 0, best: 0 } };
    }
    
    const response = await fetch(`${API_BASE_URL}/mood/streaks`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch streaks");
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Error fetching streaks:", error);
    return { moodStreak: { current: 0, best: 0 }, habitStreak: { current: 0, best: 0 } };
  }
};
