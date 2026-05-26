import express from "express";
import { getProfile, updateProfile, changeUserPassword, uploadProfilePicture } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { profileUpdateSchema } from "../validations/schemas.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get("/", authenticate, getProfile);
router.put("/", authenticate, validateRequest(profileUpdateSchema), updateProfile);
router.post("/change-password", authenticate, changeUserPassword);
router.post("/upload-picture", authenticate, upload.single("profilePicture"), uploadProfilePicture);

export default router;