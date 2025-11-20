// import nodemailer from 'nodemailer';

// const sendEmail = async (to, subject, html) => {
//   try {
//     // Create transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     // Email options
//     const mailOptions = {
//       from: `Growth Companion <${process.env.EMAIL_USER}>`,
//       to: to,
//       subject: subject,
//       html: html
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.messageId);
//     return { success: true };
//   } catch (error) {
//     console.error('Email error:', error);
//     return { success: false, error: error.message };
//   }
// };

// export default sendEmail;
// import nodemailer from 'nodemailer';

// const sendEmail = async (to, subject, html) => {
//   try {
//     console.log('📧 Attempting to send email...');
//     console.log('To:', to);
//     console.log('From:', process.env.EMAIL_USER);
    
//     // Check if credentials exist
//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       throw new Error('Email credentials not found in .env file');
//     }

//     // Create transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     // Verify connection
//     await transporter.verify();
//     console.log('✅ SMTP connection verified');

//     // Email options
//     const mailOptions = {
//       from: `Growth Companion <${process.env.EMAIL_USER}>`,
//       to: to,
//       subject: subject,
//       html: html
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Email sent successfully!');
//     console.log('Message ID:', info.messageId);
//     return { success: true };
//   } catch (error) {
//     console.error('❌ Email error:', error.message);
//     console.error('Full error:', error);
//     return { success: false, error: error.message };
//   }
// };


// export default sendEmail;
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (user) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${user.verificationCode}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify Your Email - SOLEVIA",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to SOLEVMA!</h2>
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
        console.error("❌ Error sending email:", error);
        throw new Error("Failed to send verification email");
    }
};