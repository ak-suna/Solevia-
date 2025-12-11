import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const addUsers = async ({
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
}) => {
    // Validate required fields
    if (!firstName || !email || !password) {
        throw new Error("Missing required fields");
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        throw new Error("User email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = crypto.randomBytes(32).toString("hex");
    const verificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000;

    // Create new user
    const newUser = new User({
        firstName,
        lastName: lastName || "", // optional
        email,
        password: hashedPassword,
        phone: phone || "",
        address: address || "",
        verificationCode,
        verificationCodeExpires,
        role: "user", //Default role
    });

    return await newUser.save();
};

// export const verifyUser = async ({ email, password }) => {
//     if (!email || !password) {
//         throw new Error("Email and Password required");
//     }

//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//         throw new Error("Invalid email or password");
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

//     if (!isPasswordCorrect) {
//         throw new Error("Invalid email or password");
//     }

//     return existingUser;
// };
export const verifyUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and Password required");
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    // BLOCK LOGIN IF EMAIL IS NOT VERIFIED
    if (!existingUser.isVerified) {
        throw new Error("Please verify your email before logging in");
    }

    return existingUser;
};
// 🆕 NEW: Request password reset
export const requestPasswordReset = async (email) => {
    if (!email) {
        throw new Error("Email is required");
    }

    const user = await User.findOne({ email });
    
    // Security: Don't reveal if email exists or not
    if (!user) {
        // Return success anyway to prevent email enumeration
        return { message: "If an account exists, a reset email has been sent" };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    return { user, resetToken };
};

// 🆕 NEW: Reset password with token
export const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw new Error("Token and new password are required");
    }

    // Find user with valid token
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
        throw new Error("Invalid or expired reset token");
    }

    // Hash new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return user;
};