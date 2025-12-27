// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { createServer } from "http"; 
// import connectDB from "./config/db.js";

// //routes
// import userRoutes from "./routes/auth.js";
// import adminRoutes from "./routes/admin.js";
// import moodRoutes from "./routes/moodRoutes.js";
// import journalRoutes from "./routes/journalRoutes.js";
// import profileRoutes from "./routes/profile.js";
// import habitRoutes from './routes/habitRoutes.js';
// import goalRoutes from './routes/goalRoutes.js';

// import notificationRoutes from "./routes/notificationRoutes.js";
// import { initializeSocket } from "./sockets/notificationSocket.js";
// import { startNotificationJobs, stopNotificationJobs } from "./jobs/notificationJobs.js";


// dotenv.config();

// const app = express();

// // MIDDLEWARE (ORDER MATTERS!)
// app.use(cors());
// app.use(express.json());

// const port = process.env.PORT || 3000;

// // Connect DB
// connectDB();

// // ROUTES - This is the critical part!
// app.use("/api/users", userRoutes);  // ← Make sure it says "/api/users"
// app.use("/api/admin", adminRoutes);
// app.use("/api/mood", moodRoutes);
// app.use("/api/journal", journalRoutes);
// app.use("/api/profile", profileRoutes);
// app.use('/api/habits', habitRoutes);
// app.use('/api/goals', goalRoutes);


// // Test route
// app.get("/", (req, res) => {
//     res.json({ message: "API is running" });
// });

// app.listen(port, () => {
//     console.log(`✅ Server is running on port ${port}`);
// });
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http"; // ← ADD THIS
import connectDB from "./config/db.js";

// Existing routes
import userRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import moodRoutes from "./routes/moodRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import profileRoutes from "./routes/profile.js";
import habitRoutes from './routes/habitRoutes.js';
import goalRoutes from './routes/goalRoutes.js';

// ============ NEW IMPORTS ============
import notificationRoutes from "./routes/notificationRoutes.js";
import { initializeSocket } from "./sockets/notificationSocket.js";
import { startNotificationJobs, stopNotificationJobs } from "./jobs/notificationJobs.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ============ CREATE HTTP SERVER (REQUIRED FOR SOCKET.IO) ============
const server = createServer(app);

// MIDDLEWARE (ORDER MATTERS!)
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// EXISTING ROUTES
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);

// ============ NEW NOTIFICATION ROUTE ============
app.use("/api/notifications", notificationRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({ 
        message: "API is running",
        socketEnabled: true,
        agendaEnabled: true
    });
});

// ============ INITIALIZE SOCKET.IO ============
initializeSocket(server);

// ============ START AGENDA JOBS ============
startNotificationJobs()
    .then(() => console.log("✅ Notification system initialized"))
    .catch(err => console.error("❌ Error starting Agenda:", err));

// Start server (use 'server' instead of 'app')
server.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});

// ============ GRACEFUL SHUTDOWN ============
process.on("SIGTERM", async () => {
    console.log("⚠️ SIGTERM received: shutting down gracefully");
    await stopNotificationJobs();
    server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
    });
});

process.on("SIGINT", async () => {
    console.log("⚠️ SIGINT received: shutting down gracefully");
    await stopNotificationJobs();
    server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
    });
});