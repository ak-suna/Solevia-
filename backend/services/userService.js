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
