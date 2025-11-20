import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

// MIDDLEWARE (ORDER MATTERS!)
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Connect DB
connectDB();

// ROUTES - This is the critical part!
app.use("/api/users", userRoutes);  // ← Make sure it says "/api/users"
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});