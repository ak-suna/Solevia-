import express from "express";
import { loginUser, registerUser, verifyEmail} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:code", verifyEmail);

export default router;