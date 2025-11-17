import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

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

    // Create new user
    const newUser = new User({
        firstName,
        lastName: lastName || "", // optional
        email,
        password: hashedPassword,
        phone: phone || "",
        address: address || "",
    });

    return await newUser.save();
};

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

    return existingUser;
};
