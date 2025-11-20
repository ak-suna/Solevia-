import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: false, trim: true }, 
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    date: { type: Date, default: Date.now },
    role: { type: String, enum: ["user", "admin"], default: "user"}
});

export const User = model("User", userSchema);
