import { getToken } from "./auth";

const API_URL = "http://localhost:5000/api/profile";

// Get user profile
export const getProfile = async () => {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile");
    }

    return data.profile;
};

// Update user profile
export const updateProfile = async (profileData) => {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
    }

    return data;
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
    }

    return data;
};