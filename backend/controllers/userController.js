import { addUsers, verifyUser } from "../services/userService.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
    try {
        const registeredUser = await addUsers(req.body);
        console.log(registeredUser);
        const token = generateToken({
            email: registeredUser.email,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
        });
        res.status(200).json({
            message: "Registration Successfull",
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
            email: loginUser.email,
            firstName: loginUser.firstName,
            lastName: loginUser.lastName,
            
        });
        res.status(200).json({ messge: "Login Successful", token: token });
    } catch (err) {
        let status = 400;
        console.error("❌ Error on login: ", err);
        res.status(status).json({ error: err.message });
    }
};