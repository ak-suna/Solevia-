
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const getFrontendUrl = () => {
    return (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
};

// Helper function to create transporter
const getTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

export const sendVerificationEmail = async (user) => {
    try {
        const transporter = getTransporter();

        const verificationUrl = `${getFrontendUrl()}/verify-email/${user.verificationCode}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify Your Email - SOLEVIA",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to SOLEVIA!</h2>
                    <p>Hi ${user.firstName},</p>
                    <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 12px 24px; margin: 20px 0; 
                              background-color: #4CAF50; color: white; text-decoration: none; 
                              border-radius: 4px;">
                        Verify Email
                    </a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
                    <p style="color: #999; font-size: 12px;">This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Verification email sent to:", user.email);
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

export const sendPasswordResetEmail = async (user, resetToken) => {
    try {
        const transporter = getTransporter();

        const resetUrl = `${getFrontendUrl()}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request - SOLEVIA",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hi ${user.firstName},</p>
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; margin: 20px 0; 
                              background-color: #f096b3; color: white; text-decoration: none; 
                              border-radius: 4px;">
                        Reset Password
                    </a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="color: #666; word-break: break-all;">${resetUrl}</p>
                    <p style="color: #999; font-size: 12px;">This link will expire in 1 hour.</p>
                    <p style="color: #d9534f; font-weight: bold;">⚠️ If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Password reset email sent to:", user.email);
    } catch (error) {
        console.error("❌ Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};
export const sendNotificationEmail = async (user, notification) => {
    try {
        const transporter = getTransporter();

        const priorityColors = {
            HIGH: "#d9534f",
            MEDIUM: "#f0ad4e",
            LOW: "#5bc0de"
        };

        const color = priorityColors[notification.priority] || "#5bc0de";

        let actionButton = "";
        if (notification.data?.actionUrl) {
            actionButton = `
                <a href="${getFrontendUrl()}${notification.data.actionUrl}" 
                   style="display: inline-block; padding: 12px 24px; margin: 20px 0; 
                          background-color: ${color}; color: white; text-decoration: none; 
                          border-radius: 4px;">
                    View Details
                </a>
            `;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `${notification.title} - SOLEVIA`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: ${color}; color: white; padding: 15px; border-radius: 4px 4px 0 0;">
                        <h2 style="margin: 0; color: white;">${notification.title}</h2>
                        <span style="font-size: 12px; opacity: 0.9;">${notification.priority} Priority</span>
                    </div>
                    <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 4px 4px;">
                        <p>Hi ${user.firstName},</p>
                        <p style="font-size: 16px; line-height: 1.6;">${notification.message}</p>
                        ${actionButton}
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px;">
                            You can manage your notification preferences in your 
                            <a href="${getFrontendUrl()}/settings">account settings</a>.
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Notification email sent to: ${user.email}`);
    } catch (error) {
        console.error("❌ Error sending notification email:", error);
        throw new Error("Failed to send notification email");
    }
};
// Send email to user when disabled by admin
export const sendUserDisabledEmail = async (user, reason) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Account Has Been Disabled - SOLEVIA",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d9534f;">Account Disabled</h2>
                    <p>Hi ${user.firstName},</p>
                    <p>Your account has been disabled by an administrator for the following reason:</p>
                    <blockquote style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 4px;">${reason}</blockquote>
                    <p>If you believe this is a mistake or need further assistance, please contact support at <a href="mailto:anuskagc100@gmail.com">anuskagc100@gmail.com</a>.</p>
                    <p style="color: #999; font-size: 12px;">You will not be able to log in until your account is re-enabled.</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Disabled account email sent to: ${user.email}`);
    } catch (error) {
        console.error("❌ Error sending disabled account email:", error);
        throw new Error("Failed to send disabled account email");
    }
};

export const sendAccountDeactivatedEmail = async (user) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Account Has Been Deactivated - SOLEVIA",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #f0ad4e;">Account Deactivated</h2>
                    <p>Hi ${user.firstName},</p>
                    <p>Your account has been successfully deactivated.</p>
                    <p>Your profile and content are now hidden from the community. You will not receive any further notifications from us while your account is in this state.</p>
                    <p>Whenever you are ready to return, simply log in to your account with your email and password, and click <strong>Restore</strong> to reactivate your account and pick up right where you left off.</p>
                    <br/>
                    <p>Take care,</p>
                    <p>The SOLEVIA Team</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Deactivation email sent to: ${user.email}`);
    } catch (error) {
        console.error("❌ Error sending deactivation email:", error);
        // We do not throw an error here to prevent blocking the deactivation flow if email fails
    }
};

export const sendAccountDeletionRequestedEmail = async (user, expirationDate) => {
    try {
        const transporter = getTransporter();
        const formattedDate = new Date(expirationDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Account Deletion Request Received - SOLEVIA",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d9534f;">Account Deletion Request</h2>
                    <p>Hi ${user.firstName},</p>
                    <p>We have received your request to permanently delete your SOLEVIA account.</p>
                    <p>Your account is now scheduled for permanent deletion on <strong>${formattedDate}</strong>. After this date, all of your private data (journals, habits, mood logs, and goals) will be permanently erased and cannot be recovered.</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #5bc0de; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Changed your mind?</strong></p>
                        <p style="margin: 10px 0 0 0;">You have a 30-day grace period to cancel this request. If you wish to keep your account, simply log in before ${formattedDate} and click <strong>Cancel Deletion</strong>.</p>
                    </div>
                    <p>If you meant to do this, no further action is required from you.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p>The SOLEVIA Team</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Deletion request email sent to: ${user.email}`);
    } catch (error) {
        console.error("❌ Error sending deletion request email:", error);
    }
};
