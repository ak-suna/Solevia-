import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT secret key is missing.");
    }

    return jwt.sign(payload, secret, { expiresIn: "1h" });
};