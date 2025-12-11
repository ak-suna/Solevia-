import { addUsers, verifyUser, requestPasswordReset, resetPassword } from "../services/userService.js";
import { generateToken } from "../utils/generateToken.js";
import { sendVerificationEmail, sendPasswordResetEmail  } from "../utils/sendEmail.js";
import { User } from "../models/User.js";


export const registerUser = async (req, res) => {
    try {
        const registeredUser = await addUsers(req.body);
        console.log(registeredUser);

        // Send verification email
        await sendVerificationEmail(registeredUser);

        const token = generateToken({
            id: registeredUser._id,
            email: registeredUser.email,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            role: registeredUser.role,
            isVerified: registeredUser.isVerified
        });
        res.status(200).json({
            message: "Registration Successfull. Please check your email to verify your account.",
            token: token,
        });
    } catch (err) {
        let status = 400;
        if (err.message === "Missing required fields") {
            status = 404;
        }
        console.error("❌ Error registering user: ", err);
        res.status(status).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const loginUser = await verifyUser(req.body);
        const token = generateToken({
            id: loginUser._id,  
            email: loginUser.email,
            firstName: loginUser.firstName,
            lastName: loginUser.lastName,
            role: loginUser.role,
            isVerified: loginUser.isVerified
            
        });
        res.status(200).json({ message: "Login Successful", token: token,role: loginUser.role, isVerified: loginUser.isVerified});
    } catch (err) {
        let status = 400;
        console.error("❌ Error on login: ", err);
        res.status(status).json({ error: err.message });
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const { code } = req.params;

        // Find user by code, even if already verified
        const user = await User.findOne({ verificationCode: code });

        // if (!user) {
        //     return res.status(400).json({ error: "Invalid or expired verification code" });
        // }
        if (!user) {
    // Check if code was already used (user is verified)
    const alreadyVerifiedUser = await User.findOne({ isVerified: true });
    if (alreadyVerifiedUser) {
        return res.status(200).json({
            success: true,
            message: "Email already verified."
        });
    }

    return res.status(400).json({ error: "Invalid or expired verification code" });
}


        if (user.isVerified) {
            // Already verified → return 200 with proper message
            return res.status(200).json({ success: true, message: "Email already verified. You can log in." });
        }

        // Verify the user
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Email verified successfully! You can now log in." });
    } catch (err) {
        console.error("❌ Error verifying email: ", err);
        res.status(500).json({ error: "Email verification failed" });
    }
};
// 🆕 NEW: Forgot password - send reset email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await requestPasswordReset(email);

        // If user exists, send email
        if (result.user) {
            await sendPasswordResetEmail(result.user, result.resetToken);
        }

        // Always return success (security best practice)
        res.status(200).json({ 
            message: "If an account with that email exists, a password reset link has been sent." 
        });
    } catch (err) {
        console.error("❌ Error in forgot password: ", err);
        res.status(500).json({ error: "Failed to process password reset request" });
    }
};

// 🆕 NEW: Reset password with token
export const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ 
                error: "Password must be at least 6 characters long" 
            });
        }

        await resetPassword(token, password);

        res.status(200).json({ 
            success: true,
            message: "Password reset successful! You can now log in with your new password." 
        });
    } catch (err) {
        console.error("❌ Error resetting password: ", err);
        res.status(400).json({ error: err.message });
    }
};

// export const verifyEmail = async (req, res) => {
//     try {
//         const { code } = req.params;
        
//         const user = await User.findOne({
//             verificationCode: code,
//             verificationCodeExpires: { $gt: Date.now() }
//         });

//         if (!user) {
//             return res.status(400).json({ error: "Invalid or expired verification code" });
//         }

//         user.isVerified = true;
//         user.verificationCode = undefined;
//         user.verificationCodeExpires = undefined;
//         await user.save();

//         res.status(200).json({ message: "Email verified successfully! You can now log in." });
//     } catch (err) {
//         console.error("❌ Error verifying email: ", err);
//         res.status(500).json({ error: "Email verification failed" });
//     }
// };