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