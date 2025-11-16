// // const express = require('express');
// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // app.get('/', (req, res) => {
// //   res.send('Welcome Anuska');
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// // const express = require('express');
// // const mongoose = require('mongoose');

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // // ✅ Replace this with your Atlas URI if needed
// // const MONGO_URI = "mongodb://localhost:27017/testdb";

// // // ✅ Connect to MongoDB
// // mongoose.connect(MONGO_URI)
// //   .then(() => console.log("✅ MongoDB connected"))
// //   .catch(err => console.log("❌ MongoDB connection error:", err));

// // app.get('/', (req, res) => {
// //   res.send('MongoDB Test Successful ✅');
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });



// // require('dotenv').config(); // load .env variables
// // const express = require('express');
// // const connectDB = require('./config/db'); // adjust path if needed

// // const app = express();

// // // Connect to MongoDB
// // connectDB(); // this will run the connection code in db.js

// // // Middleware to parse JSON
// // app.use(express.json());

// // // Test route
// // app.get('/', (req, res) => {
// //   res.send('Backend is running and DB connection tested!');
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";

// dotenv.config(); // Load variables from .env
// connectDB();     // Connect to MongoDB

// const app = express();
// app.use(express.json()); // To handle JSON requests

// app.get("/", (req, res) => {
//   res.send("API is running successfully.");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// IMPORTANT: Middleware order matters!
// 1. CORS must come BEFORE routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React app
  credentials: true
}));

// 2. Then body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Connect to MongoDB
connectDB();

// 4. Routes
app.use("/api/auth", authRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});