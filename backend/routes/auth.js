import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword, phone, address  } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all the required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    if (phone && !/^\d{10}$/.test(phone.replace(/[-\s]/g, ''))) {
      return res.status(400).json({ msg: "Please enter a valid 10-digit phone number" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      address
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token expires in 7 days
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import sendEmail from "../utils/sendEmail.js";

// const router = express.Router();

// // Generate 6-digit OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // @route   POST /api/auth/signup
// router.post("/signup", async (req, res) => {
//   const { name, email, password, confirmPassword, phone, address } = req.body;

//   try {
//     if (!name || !email || !password || !confirmPassword) {
//       return res.status(400).json({ msg: "Please enter all required fields" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ msg: "Password must be at least 6 characters" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ msg: "Passwords do not match" });
//     }

//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // ✨ GENERATE OTP ✨
//     const verificationCode = generateOTP();
//     const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Create new user
//     user = new User({
//       name,
//       email,
//       password,
//       phone,
//       address,
//       isVerified: false,
//       verificationCode,
//       verificationCodeExpires
//     });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // ✨ SEND VERIFICATION EMAIL ✨
//     const emailHtml = `
//       <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 10px;">
//         <h2 style="color: #4CAF50; text-align: center;">Welcome to Growth Companion! 🎉</h2>
//         <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
//         <p style="font-size: 14px;">Thank you for signing up! Please use the verification code below to verify your email address:</p>
        
//         <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
//           <h1 style="color: #333; letter-spacing: 5px; font-size: 36px; margin: 0;">${verificationCode}</h1>
//         </div>
        
//         <p style="font-size: 14px; color: #666;">This code will expire in <strong>10 minutes</strong>.</p>
//         <p style="font-size: 14px; color: #666;">If you didn't create an account, please ignore this email.</p>
        
//         <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
//         <p style="font-size: 12px; color: #999; text-align: center;">Growth Companion - Every small step counts</p>
//       </div>
//     `;

//     await sendEmail(email, 'Verify Your Email - Growth Companion', emailHtml);

//     res.json({
//       msg: "Signup successful! Please check your email for verification code.",
//       email: email // Send email to frontend so we know which user to verify
//     });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // ✨ NEW ROUTE: VERIFY OTP ✨
// router.post("/verify-otp", async (req, res) => {
//   const { email, code } = req.body;

//   try {
//     if (!email || !code) {
//       return res.status(400).json({ msg: "Please provide email and verification code" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ msg: "Email already verified" });
//     }

//     // Check if code matches
//     if (user.verificationCode !== code) {
//       return res.status(400).json({ msg: "Invalid verification code" });
//     }

//     // Check if code expired
//     if (user.verificationCodeExpires < Date.now()) {
//       return res.status(400).json({ msg: "Verification code has expired. Please request a new one." });
//     }

//     // ✅ VERIFY USER
//     user.isVerified = true;
//     user.verificationCode = undefined; // Remove code after verification
//     user.verificationCodeExpires = undefined;
//     await user.save();

//     // Create JWT token for auto-login after verification
//     const payload = { user: { id: user.id } };
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({
//           msg: "Email verified successfully!",
//           token,
//           user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             phone: user.phone,
//             address: user.address,
//             isVerified: user.isVerified
//           }
//         });
//       }
//     );

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // ✨ NEW ROUTE: RESEND OTP ✨
// router.post("/resend-otp", async (req, res) => {
//   const { email } = req.body;

//   try {
//     if (!email) {
//       return res.status(400).json({ msg: "Please provide email" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ msg: "Email already verified" });
//     }

//     // Generate new OTP
//     const verificationCode = generateOTP();
//     const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

//     user.verificationCode = verificationCode;
//     user.verificationCodeExpires = verificationCodeExpires;
//     await user.save();

//     // Send email
//     const emailHtml = `
//       <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 10px;">
//         <h2 style="color: #4CAF50; text-align: center;">New Verification Code</h2>
//         <p style="font-size: 16px;">Hi <strong>${user.name}</strong>,</p>
//         <p style="font-size: 14px;">Here's your new verification code:</p>
        
//         <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
//           <h1 style="color: #333; letter-spacing: 5px; font-size: 36px; margin: 0;">${verificationCode}</h1>
//         </div>
        
//         <p style="font-size: 14px; color: #666;">This code will expire in <strong>10 minutes</strong>.</p>
//       </div>
//     `;

//     await sendEmail(email, 'New Verification Code - Growth Companion', emailHtml);

//     res.json({ msg: "New verification code sent to your email" });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Update LOGIN to check if email is verified
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       return res.status(400).json({ msg: "Please enter all fields" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     // ✨ CHECK IF EMAIL IS VERIFIED ✨
//     if (!user.isVerified) {
//       return res.status(400).json({ 
//         msg: "Please verify your email before logging in",
//         needsVerification: true,
//         email: user.email
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const payload = { user: { id: user.id } };
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({
//           token,
//           user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             phone: user.phone,
//             address: user.address,
//             isVerified: user.isVerified
//           }
//         });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// export default router;