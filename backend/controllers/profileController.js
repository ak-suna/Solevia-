import { getUserProfile, updateUserProfile, changePassword } from "../services/profileService.js";

// Get current user's profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From authenticate middleware
        const profile = await getUserProfile(userId);
        
        res.status(200).json({ 
            success: true,
            profile 
        });
    } catch (err) {
        console.error("❌ Error getting profile:", err);
        res.status(404).json({ error: err.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        
        const updatedProfile = await updateUserProfile(userId, updates);
        
        res.status(200).json({ 
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });
    } catch (err) {
        console.error("❌ Error updating profile:", err);
        res.status(400).json({ error: err.message });
    }
};

// Change password
export const changeUserPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        const result = await changePassword(userId, currentPassword, newPassword);
        
        res.status(200).json({ 
            success: true,
            message: result.message
        });
    } catch (err) {
        console.error("❌ Error changing password:", err);
        res.status(400).json({ error: err.message });
    }
};