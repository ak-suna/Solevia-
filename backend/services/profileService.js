import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

// Get user profile by ID
export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-password -verificationCode -resetPasswordToken");
    
    if (!user) {
        throw new Error("User not found");
    }
    
    return user;
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
    const { firstName, lastName, phone, address } = updates;
    
    // Don't allow email or password changes through this function
    const allowedUpdates = { firstName, lastName, phone, address };
    
    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => 
        allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );
    
    const user = await User.findByIdAndUpdate(
        userId,
        allowedUpdates,
        { new: true, runValidators: true }
    ).select("-password -verificationCode -resetPasswordToken");
    
    if (!user) {
        throw new Error("User not found");
    }
    
    return user;
};

// Change password (requires current password)
export const changePassword = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw new Error("Current password and new password are required");
    }
    
    if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
        throw new Error("User not found");
    }
    
    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordCorrect) {
        throw new Error("Current password is incorrect");
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    return { message: "Password changed successfully" };
};