import { getUserProfile, updateUserProfile, changePassword } from "../services/profileService.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { User } from "../models/User.js";

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
export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const streamUpload = (buffer) =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profile_pictures", transformation: [{ width: 300, height: 300, crop: "fill" }] },
                    (error, result) => { if (result) resolve(result); else reject(error); }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });

        const result = await streamUpload(req.file.buffer);
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { profilePicture: result.secure_url },
            { new: true }
        ).select("-password -verificationCode -resetPasswordToken");

        res.status(200).json({ success: true, profilePicture: result.secure_url, profile: user });
    } catch (err) {
        console.error("❌ Error uploading picture:", err);
        res.status(500).json({ error: "Failed to upload picture" });
    }
};